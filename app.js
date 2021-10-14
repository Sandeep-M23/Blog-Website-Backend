const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const blogRoutes = require("./Routes/Blog-routes");
const userRoutes = require("./Routes/User-routes");
const HttpError = require("./Models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    ),
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/blogs", blogRoutes);
app.use("/user",userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An Unknown Error Has Been Detected!" });
});


mongoose
  .connect(
    "mongodb+srv://sandeep_m:pYyYE0lGyjpgHU5H@cluster0.szf4e.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
