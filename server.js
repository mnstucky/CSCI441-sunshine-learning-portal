// Load basic routing services
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Load local environmental variables
require("dotenv").config();

// Load services for user authentication
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

// Load services
const { pool, getUserById, getQuestionsByTrack } = require("./model/db.js");
const { selectRandomQuestions } = require("./services/learning.js");
const { sendEmail } = require("./services/contact.js");

// Serve static files in the public directory as /public/
app.use("/public", express.static("public"));

// Parse the body of get/post requests
app.use(bodyParser.urlencoded({ extended: false }));

// Setup user authentication logic
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(async function (username, password, done) {
    const text = "SELECT * FROM student_info WHERE studentid = $1";
    const values = [username];
    pool.query(text, values, (err, user) => {
      console.log(`User ${username} attempted to log in.`);
      if (err) {
        return done(err);
      }
      if (user.rows.length === 0) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!bcrypt.compareSync(password, user.rows[0].password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user.rows[0]);
    });
  })
);

// Define middleware to redirect pages to login if no-one is logged in
function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login/");
  }
}

// Set templating engine to EJS
app.set("view engine", "ejs");

// Define routes

app.route("/").get(loggedIn, (req, res) => {
  const {
    firstname,
    lastname,
    studentid,
    studentemail,
    teachername,
    teacheremail,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;
  res.render(`${__dirname}/views/profile`, {
    studentname: `${firstname} ${lastname}`,
    studentid,
    studentemail,
    teachername,
    teacheremail,
    schoolname,
    schooladdress,
    schoolphone,
  });
});

app.route("/profile/").get(loggedIn, (req, res) => {
  const {
    firstname,
    lastname,
    studentid,
    studentemail,
    teachername,
    teacheremail,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;
  res.render(`${__dirname}/views/profile`, {
    studentname: `${firstname} ${lastname}`,
    studentid,
    studentemail,
    teachername,
    teacheremail,
    schoolname,
    schooladdress,
    schoolphone,
  });
});

app.get("/login/", (req, res) => {
  res.render(`${__dirname}/views/login`, {
    studentname: "",
    errorMessage: req.flash("error"),
  });
});

// Handle sign in form submissions
app.route("/login/").post(
  passport.authenticate("local", {
    failureRedirect: "/login/",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/profile/");
  }
);

app.route("/contact/").get(loggedIn, (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;
  res.render(`${__dirname}/views/contact`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
  });
});

app.route("/api/contact/").post(async (req, res) => {
  const {
    firstname,
    lastname,
    studentemail,
    schoolname,
    schooladdress,
    schoolphone,
    teachername,
    teacheremail,
  } = req.user;
  const { myQuestion } = req.body;
  const from = studentemail;
  const to = teacheremail;
  const subject = `Question from ${firstname} ${lastname}`;
  const text = myQuestion;
  const success = await sendEmail(from, to, subject, text);
  if (success) {
    res.render(`${__dirname}/views/contactresults`, {
      contactmessage: `Message sent to ${teachername} at ${teacheremail}.`,
      studentname: `${firstname} ${lastname}`,
      schoolname,
      schooladdress,
      schoolphone,
    });
  } else {
    res.render(`${__dirname}/views/contactresults`, {
      contactmessage: "Sorry, something went wrong. Please try again.",
      studentname: `${firstname} ${lastname}`,
      schoolname,
      schooladdress,
      schoolphone,
    });
  }
});

app.route("/discussions/").get(loggedIn, (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;

  res.render(`${__dirname}/views/discussions`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
  });
});

app.route("/leaders/").get(loggedIn, (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;

  res.render(`${__dirname}/views/leaders`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
  });
});

app.route("/learning/").get(loggedIn, (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;
  res.render(`${__dirname}/views/learning`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
  });
});

app.route("/api/").get(loggedIn, async (req, res) => {
  const action = req.query.action;
  const num = req.query.num;
  const track = req.query.track;
  switch (action) {
    case "getquestions":
      const allQuestions = await getQuestionsByTrack(track);
      const selectedQuestions = selectRandomQuestions(allQuestions, num);
      res.json(selectedQuestions);
      break;
  }
});

app.route("/logout/").get((req, res) => {
  req.logout();
  res.redirect("/");
});

// Store user sessions as cookies
passport.serializeUser((user, done) => {
  done(null, user.studentid);
});
passport.deserializeUser(async (username, done) => {
  const user = await getUserById(username);
  done(null, user);
});

// Start server
app.listen(port, () => console.log(`App listening on port ${port}.`));
