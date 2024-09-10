import express from "express";

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

export default router;
