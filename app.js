const express = require("express");
const bodyParser = require("body-parser");

const blogRoutes = require('./Routes/Blog-routes');

const app = express();

app.use(blogRoutes);

app.listen(5000);