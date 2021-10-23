const fs = require('fs');
const mongoose = require("mongoose");
const {validationResult} = require('express-validator');

const HttpError = require('../Models/http-Error');
const Blog = require('../Models/blog');
const User = require('../Models/user');

const getAllBlogs =  async(req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find({});
  } catch (err) {
    const error = new HttpError(
      "Something Went Wrong ,could not Find Blogs",
      500
    );
    return next(error);
  }
  res.json({ blogs: blogs.map((blog) => blog.toObject({ getters: true })) });
};

const getBlogsById = async(req, res, next) => {
  const blogId = req.params.pid;

  let blog;
  try {
    blog = await Blog.findById(blogId);
  } catch (err) {
    const error = new HttpError(
      "Something Went Wrong ,could not Find Blog",
      500
    );
    return next(error);
  }

  if (!blog) {
    const error = new HttpError(
      "Could not find the blog for the provided Id.",
      404
    );
    return next(error);
  }

  res.json({ blog: blog.toObject({ getters: true }) });
};

const getBlogsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithBlogs;
  try {
    userWithBlogs = await User.findById(userId).populate("blogs");
  } catch (err) {
    const error = new HttpError(
      "Something Went Wrong ,could not Find Blog",
      500
    );
    return next(error);
  }

  if (!userWithBlogs) {
    return next(
      new HttpError("Could not find the blogs for the provided user Id.", 404)
    );
  }

  res.json({
    blogs: userWithBlogs.blogs.map((blog) => blog.toObject({ getters: true })),
  });
};

const createBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description} = req.body;


  const createdBlog = new Blog({
    title,
    description,
    image: req.file.path,
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating blog failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBlog.save({ session: sess });
    user.blogs.push(createdBlog);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating blog failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ blog: createdBlog });
};

const updateBlog =  async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const blogId = req.params.pid;

  let blog;
  try{
    blog = await Blog.findById(blogId)
  }catch(err){
    const error = new HttpError(
      "Something Went Wrong ,could not Find Blog",
      500
    );
    return next(error);
  }

  if (blog.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
  }

  blog.title = title;
  blog.description = description;

  try {
    await blog.save();
  } catch (err) {
    const error = new HttpError(
      "Something Went Wrong ,could not Find Blog",
      500
    );
    return next(error);
  }

  res.status(201).json({ blog: blog.toObject({ getters: true }) });
};

const deleteBlog = async (req, res, next) => {
  const blogId = req.params.pid;

  let blog;
  try {
    blog = await Blog.findById(blogId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete blog.',
      500
    );
    return next(error);
  }

  if (!blog) {
    const error = new HttpError('Could not find blog for this id.', 404);
    return next(error);
  }

  if (blog.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this blog.',
      401
    );
    return next(error);
  }

  const imagePath = blog.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await blog.remove({ session: sess });
    blog.creator.blogs.pull(blog);
    await blog.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete blog.',
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted blog.' });
};


exports.getAllBlogs = getAllBlogs;
exports.getBlogsById = getBlogsById;
exports.getBlogsByUserId = getBlogsByUserId;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
