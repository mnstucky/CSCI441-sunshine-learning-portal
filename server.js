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

// Load database services
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

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
  console.log(req.user.rows[0]);
  res.render(`${__dirname}/views/profile`, {
    studentname: `${req.user.rows[0].firstname} ${req.user.rows[0].lastname}`,
    studentid: `${req.user.rows[0].studentid}`,
    studentemail: `${req.user.rows[0].studentemail}`,
    teachername: `${req.user.rows[0].teachername}`,
    teacheremail: `${req.user.rows[0].teacheremail}`,
    schoolname: `${req.user.rows[0].schoolname}`,
    schooladdress: `${req.user.rows[0].schooladdress}`,
    schoolphone: `${req.user.rows[0].schoolphone}`,
  }); // TODO: Clean up user object
});

app.route("/profile/").get(loggedIn, (req, res) => {
  res.render(`${__dirname}/views/profile`, {
    studentname: `${req.user.rows[0].firstname} ${req.user.rows[0].lastname}`,
    studentid: `${req.user.rows[0].studentid}`,
    studentemail: `${req.user.rows[0].studentemail}`,
    teachername: `${req.user.rows[0].teachername}`,
    teacheremail: `${req.user.rows[0].teacheremail}`,
    schoolname: `${req.user.rows[0].schoolname}`,
    schooladdress: `${req.user.rows[0].schooladdress}`,
    schoolphone: `${req.user.rows[0].schoolphone}`,
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
  res.render(`${__dirname}/views/contact`, {
    studentname: `${req.user.rows[0].firstname} ${req.user.rows[0].lastname}`,
    schoolname: `${req.user.rows[0].schoolname}`,
    schooladdress: `${req.user.rows[0].schooladdress}`,
    schoolphone: `${req.user.rows[0].schoolphone}`,
  });
});

app.route("/discussions/").get(loggedIn, (req, res) => {
  res.render(`${__dirname}/views/discussions`, {
    studentname: `${req.user.rows[0].firstname} ${req.user.rows[0].lastname}`,
    schoolname: `${req.user.rows[0].schoolname}`,
    schooladdress: `${req.user.rows[0].schooladdress}`,
    schoolphone: `${req.user.rows[0].schoolphone}`,
  });
});

app.route("/leaders/").get(loggedIn, (req, res) => {
  res.render(`${__dirname}/views/leaders`, {
    studentname: `${req.user.rows[0].firstname} ${req.user.rows[0].lastname}`,
    schoolname: `${req.user.rows[0].schoolname}`,
    schooladdress: `${req.user.rows[0].schooladdress}`,
    schoolphone: `${req.user.rows[0].schoolphone}`,
  });
});

app.route("/learning/").get(loggedIn, (req, res) => {
  res.render(`${__dirname}/views/learning`, {
    studentname: `${req.user.rows[0].firstname} ${req.user.rows[0].lastname}`,
    schoolname: `${req.user.rows[0].schoolname}`,
    schooladdress: `${req.user.rows[0].schooladdress}`,
    schoolphone: `${req.user.rows[0].schoolphone}`,
  });
});

app.route("/logout/").get((req, res) => {
  req.logout();
  res.redirect("/");
});

// Store user sessions as cookies
passport.serializeUser((user, done) => {
  done(null, user.studentid);
});
passport.deserializeUser((username, done) => {
  const text = "SELECT * FROM student_info WHERE studentid = $1";
  const values = [username];
  pool.query(text, values, (err, user) => {
    done(err, user);
  });
});

// Start server
app.listen(port, () => console.log(`App listening on port ${port}.`));
