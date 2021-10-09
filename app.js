const express = require("express");

const bodyParser = require("body-parser");

const blogRoutes = require("./Routes/Blog-routes");
const userRoutes = require("./Routes/User-routes");
const HttpError = require("./Models/http-error");

const app = express();

app.use(bodyParser.json());

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

app.listen(5000);
