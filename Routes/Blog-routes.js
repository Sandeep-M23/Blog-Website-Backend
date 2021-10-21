const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const blogControllers = require("../Controllers/Blog-controllers");

const fileUpload = require("../Middleware/File-Upload");

const checkAuth = require("../Middleware/Check-Auth.js");

router.get("/", blogControllers.getAllBlogs);

router.get("/:pid", blogControllers.getBlogsById);

router.get("/user/:uid", blogControllers.getBlogsByUserId);

router.use(checkAuth);

router.post(
  "/create",
  fileUpload.single("image"),
  [(check("title").not().isEmpty(), check("description").not().isEmpty())],
  blogControllers.createBlog
);

router.patch("/:pid", blogControllers.updateBlog);

router.delete("/:pid", blogControllers.deleteBlog);

module.exports = router;