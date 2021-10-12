const express = require("express");

const { validationResult } = require("express-validator");

const HttpError = require("../Models/http-Error");
const User = require('../Models/user');

const signup = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try{
    existingUser = await User.findOne({email:email})
  }catch(err){
    const error = new HttpError(
      "Signing up Failed ! Please Try Again Later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User Already exists! Please Login", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    blogs,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing Up Failed! Please Try Again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async(req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try{
    existingUser = await User.findOne({email:email})
  }catch(err){
    const error = new HttpError(
      "Signing up Failed ! Please Try Again Later",
      500
    );
    return next(error);
  }

  if(!existingUser || existingUser.password !== password){
    const error = new HttpError(
      "Invalid credentials ! Could not Login",
      401
    );
    return next(error);
  }

  res.json({ message: "LOGGED IN" });
};

exports.login = login;
exports.signup = signup;
