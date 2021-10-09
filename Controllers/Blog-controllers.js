const express = require("express");
const {validationResult} = require('express-validator')

const HttpError = require('../Models/http-Error');

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

const getBlogsById = (req, res, next) => {
  console.log("GET BLOGS BY ID");
  const blogId = req.params.pid;
  let blog;
  blog = DUMMY_BLOGS.find((p) => {
    return p.id === blogId;
  });

  if (!blog) {
    throw new HttpError("Could not find the blog for the provided Id.", 404);
  }

  res.json({ blog });
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

const createBlog = (req, res, next) => {
  console.log("POST A NEW BLOG");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  
  const { title, description, creatorId } = req.body;

  const createdBlog = {
    title,
    description,
    creatorId,
  };

  DUMMY_BLOGS.push(createdBlog);

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
