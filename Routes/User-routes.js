const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const userControllers = require("../Controllers/User-controllers");

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userControllers.signup
);

router.post("/login", userControllers.login);

module.exports = router;