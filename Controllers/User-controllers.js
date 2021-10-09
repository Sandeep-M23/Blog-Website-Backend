const express = require("express");

const { validationResult } = require("express-validator");

const HttpError = require("../Models/http-Error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Rahul S",
    email: "test@test.com",
    password: "testers",
  },
];

const signup = (req, res, next) => {
  console.log("SIGNUP");
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      throw new HttpError('Invalid inputs passed, please check your data.', 422)
  }
  const { name, email, password } = req.body;

  const hasUsers = DUMMY_USERS.find((u) => u.email === email);
  if (hasUsers) {
    throw new HttpError("Could not create user, Email already exists!", 422);
  }

  const createdUser = {
    id: "u3",
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  console.log("LOGIN");
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user,Credentials might be wrong !",
      401
    );
  }

  res.json({ message: "LOGGED IN" });
};

exports.login = login;
exports.signup = signup;
