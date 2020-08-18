const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/user");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/groups/explore",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/register", function (req, res) {
  let newUser = new User({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/groups/explore");
    });
  });
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.get("/profile/:id", function (req, res) {
  res.render("profile");
});

router.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/login");
});

router.get("/", function (req, res) {
  if (req.isAuthenticated()) res.redirect("/groups/explore");
  else res.redirect("/login");
});

module.exports = router;
