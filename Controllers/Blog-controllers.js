const express = require("express");
const mongoose = require("mongoose");
const {validationResult} = require('express-validator');

const HttpError = require('../Models/http-Error');
const Blog = require('../Models/blog');

let DUMMY_BLOGS = [
  {
    id: "b1",
    title: "The Eiffel Tower",
    description:
      "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
    creatorId: "p1",
  },
  {
    id: "b2",
    title: "The Eiffel Tower",
    description:
      "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
    creatorId: "p2",
  },
];

const getAllBlogs =  (req, res, next) => {
  console.log("GET ALL BLOGS");
  res.json({ blogs: DUMMY_BLOGS });
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

const getBlogsByUserId = (req, res, next) => {
  console.log("GET BLOGS BY USER ID");
  const userId = req.params.uid;
  let blogs;
  blogs = DUMMY_BLOGS.filter((user)=>{
    return user.creatorId === userId;
  });

  if (!blogs || blogs.length === 0) {
    return next(
      new HttpError("Could not find the blogs for the provided user Id.", 404)
    );
  }

  res.json({ blogs });
};

const createBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, creatorId } = req.body;

  const createdBlog = new Blog({
    title,
    description,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvo01uSr4X5jWbAu1-wZ6zy23mKrEMtv8MFA&usqp=CAU",
    creatorId,
  });

  try {
    await createdBlog.save();
  } catch (err) {
    const error = new HttpError("Creating Blog Failed! Please Try Again.", 500);
    return next(error);
  }

  res.status(201).json({ blog: createdBlog });
};

const updateBlog =  (req, res, next) => {
  console.log("UPDATE/EDIT BLOG");
  const { title, description } = req.body;
  const blogId = req.params.pid;

  const updatedBlog = {
    ...DUMMY_BLOGS.find((p) => {
      return p.id === blogId;
    }),
  };
  const BlogIndex = DUMMY_BLOGS.findIndex((p) => p.id === blogId);
  updatedBlog.title = title;
  updatedBlog.description = description;

  DUMMY_BLOGS[BlogIndex] = updatedBlog;

  res.status(201).json({ blog: updatedBlog });
};

const deleteBlog =  (req, res, next) => {
  console.log("DELETE BLOG");
  const blogId = req.params.pid;
  DUMMY_BLOGS = DUMMY_BLOGS.filter((p)=>{
    return p.id !== blogId
  });

  res.status(200).json({message:'Deleted Blog.'})
};

exports.getAllBlogs = getAllBlogs;
exports.getBlogsById = getBlogsById;
exports.getBlogsByUserId = getBlogsByUserId;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
