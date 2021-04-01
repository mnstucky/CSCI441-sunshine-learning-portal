"use strict";

// Load basic routing services
const express = require("express");
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

// Load DB services
const {
  pool,
  getUserById,
  getQuestionsByTrack,
  getQuestionById,
  getTracks,
  getTrackName,
  getLearningMaterials,
  getTestResults,
  getTop10,
  getBadges,
  getUserTracks,
  getAllTestResults,
  getThreads,
  getTotalPosts,
  getUnreadPostCount,
  getUnreadReplyCount,
  addThread,
  addPost,
  addTracker,
  getPosts,
} = require("./model/db.js");

// Load other services
const {
  selectRandomQuestions,
  canUserSkipTrack,
  subscribeToTrack,
  unsubscribeFromTrack,
  submitResult,
  getInProcessTracks,
  getCompletedTracks,
} = require("./services/learning.js");
const { sendEmail } = require("./services/contact.js");
const { loggedIn } = require("./services/login.js");

// Serve static files in the public directory as /public/
app.use("/public", express.static("public"));

// Parse the body of get/post requests
app.use(express.json());
app.use(express.urlencoded());

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
    const user = await getUserById(username);
    console.log(`User ${username} attempted to log in.`);
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  })
);

// Set templating engine to EJS
app.set("view engine", "ejs");

// Define routes

app.route("/").get(loggedIn, async (req, res) => {
  res.redirect(301, "/profile/");
});

app.route("/profile/").get(loggedIn, async (req, res) => {
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
  
  const getbadges = await getBadges(studentid);
  const badgeicon = getbadges[0]?.badgetype;
  const badgetitle = getbadges[0]?.trackname;

  const inProcessTracks = await getInProcessTracks(studentid); 
  const completedTracks = await getCompletedTracks(studentid);
   
  res.render(`${__dirname}/views/profile`, {
    studentname: `${firstname} ${lastname}`,
    studentid,
    studentemail,
    teachername,
    teacheremail,
    schoolname,
    schooladdress,
    schoolphone,
    badgeicon,
    badgetitle,
    inProcessTracks,
    completedTracks,
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

app.route("/discussions/").get(loggedIn, async (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;
  const threads = await getThreads();
  const asyncFormattedThreads = threads.map(async thread => {
    const studentId = thread.studentid;
    const student = await getUserById(studentId);
    let unreadPostCount = await getUnreadPostCount(thread.threadid);
    unreadPostCount = unreadPostCount[0].count;
    let totalPostCount = await getTotalPosts(thread.threadid);
    totalPostCount = totalPostCount[0].count;
    return { ...thread, firstName: student.firstname, lastName: student.lastname, unreadPostCount, totalPostCount };
  });
  const formattedThreads = await Promise.all(asyncFormattedThreads); 
  res.render(`${__dirname}/views/discussions`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
    formattedThreads,
  });
});

app.route("/discussions/createthread").get(loggedIn, async (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;
  const threads = await getThreads();
  const asyncFormattedThreads = threads.map(async thread => {
    const studentId = thread.studentid;
    const student = await getUserById(studentId);
    let unreadPostCount = await getUnreadPostCount(thread.threadid);
    unreadPostCount = unreadPostCount[0].count;
    let totalPostCount = await getTotalPosts(thread.threadid);
    totalPostCount = totalPostCount[0].count;
    return { ...thread, firstName: student.firstname, lastName: student.lastname, unreadPostCount, totalPostCount };
  });
  const formattedThreads = await Promise.all(asyncFormattedThreads); 
  res.render(`${__dirname}/views/createthread`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
    formattedThreads,
  });
});

app.route("/discussions/displaythread").get(loggedIn, async (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;
  const { threadId } = req.query;
  const posts = await getPosts(threadId);
  const asyncFormattedPosts = posts.map(async post => {
    const studentId = post.studentid;
    const student = await getUserById(studentId);
    return { ...post, firstName: student.firstname, lastName: student.lastname, };
  });
  const formattedPosts = await Promise.all(asyncFormattedPosts);
  res.render(`${__dirname}/views/displaythread`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
    formattedPosts,
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

app.route("/learning/").get(loggedIn, async (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
    studentid,
  } = req.user;
  const inProcessTracks = await getInProcessTracks(studentid); 
  const completedTracks = await getCompletedTracks(studentid);
  res.render(`${__dirname}/views/learning`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
    inProcessTracks,
    completedTracks,
  });
});

app.route("/pretest/").get(loggedIn, (req, res) => {
  const {
    firstname,
    lastname,
    schoolname,
    schooladdress,
    schoolphone,
  } = req.user;
  res.render(`${__dirname}/views/track1pre-test`, {
    studentname: `${firstname} ${lastname}`,
    schoolname,
    schooladdress,
    schoolphone,
  });

})
app.route("/logout/").get((req, res) => {
  req.logout();
  res.redirect("/");
});

// Define API routes

app.route("/api/").get(loggedIn, async (req, res) => {
  const { action, num, track, id, threadid } = req.query;
  const { studentid } = req.user;
  switch (action) {
    case "getquestions":
      const allQuestions = await getQuestionsByTrack(track);
      const selectedQuestions = selectRandomQuestions(allQuestions, num);
      res.json(selectedQuestions);
      break;
    case "getquestionbyid":
      const question = await getQuestionById(id);
      res.json(question);
      break;
    case "gettracks":
      const tracks = await getTracks();
      res.json(tracks);
      break;
    case "gettrackname":
      const trackname = await getTrackName(id);
      res.send(trackname);
      break;
    case "getlearningmaterials":
      const materials = await getLearningMaterials(track);
      res.json(materials);
      break;
    case "canskip":
      const permission = await canUserSkipTrack(studentid, track);
      res.json(permission);
      break;
    case "getusertracks":
      //const usertracks = await selectUserTracks(studentid);
      const usertracks = await getUserTracks(studentid);
      res.json(usertracks);
      break;
    case "getresults":
      const results = await getTestResults(studentid, track);
      res.json(results);
      break;
    case "gettop10":
      const top10 = await getTop10(track);
      res.json(top10);
      break;
    case "getbadges":
      const badges = await getBadges(studentid);
      res.json(badges);
      break;
    case "getThreads":
      const threads = await getThreads();
      res.json(threads);
      break;
    case "getTotalPosts":
      const postcount = await getTotalPosts(threadid);
      res.json(postcount);
      break;
    case "getUnreadPostCount":
      const unreadcount = await getUnreadPostCount(threadid);
      res.json(unreadcount);
      break;    
    case "getUnreadReplyCount":
      const unreadreplycount = await getUnreadReplyCount();
      res.json(unreadreplycount);
      break;    
    case "addThread":
      const addthread = await addThread();
      res.json(addthread);
      break;    
    case "addPost":
      const addpost = await addPost();
      res.json(addpost);
      break;    
    case "addTracker":
      const addtracker = await addTracker();
      res.json(addtracker);
      break;
    default:
      res.json({});
  }
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
    // TODO: confirm that we enter this else branch if the email fails
    res.render(`${__dirname}/views/contactresults`, {
      contactmessage: "Sorry, something went wrong. Please try again.",
      studentname: `${firstname} ${lastname}`,
      schoolname,
      schooladdress,
      schoolphone,
    });
  }
});

app.route("/api/createthread/").post(async (req, res) => {
  const { studentid } = req.user;
  const { title } = req.body;
  const data = await addThread(studentid, title);
  if (data) {
    res.redirect("/discussions/");
  } else {
    res.sendStatus(412);
  }
});

app.route("/api/results/").put(async (req, res) => {
  const { trackid, test, score } = req.body;
  const { studentid } = req.user;
  const success = await submitResult(studentid, trackid, test, score);
  if (success) {
    // If new resource created
    res.sendStatus(201);
  } else {
    // If resource updated
    res.sendStatus(412);
  }
});

app.route("/api/subscribe/").put(loggedIn, async (req, res) => {
  const { trackid } = req.body;
  const { studentid } = req.user;
  const success = await subscribeToTrack(studentid, trackid);
  if (success) {
    // If new resource created
    res.sendStatus(201);
  } else {
    // If resource not created
    res.sendStatus(412);
  }
});

app.route("/api/unsubscribe/").put(loggedIn, async (req, res) => {
  const { trackid } = req.body;
  const { studentid } = req.user;
  const success = await unsubscribeFromTrack(studentid, trackid);
  if (success) {
    // If unsubscribed
    res.sendStatus(200);
  } else {
    // If nothing to unsubscribe from
    res.sendStatus(412);
  }
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
