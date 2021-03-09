// Define middleware to redirect pages to login if no-one is logged in
function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login/");
  }
}

exports.loggedIn = loggedIn;