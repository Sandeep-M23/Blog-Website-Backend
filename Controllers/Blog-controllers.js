const express = require("express");

const DUMMY_BLOGS = [
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

const getAllBlogs = async (req, res, next) => {
  console.log("GET ALL BLOGS");
  res.json({ blogs: DUMMY_BLOGS });
};

const getBlogsById = async (req, res, next) => {
  console.log("GET BLOGS BY ID");
  const blogId = req.params.pid;
  let blog;
  blog = DUMMY_BLOGS.find((p) => {
    return p.id === blogId;
  });

  if(!blog){
      res.status(404).json({message:'Could not find blog'})
  }

  res.json({ blog });
};

const getBlogsByUserId = async (req, res, next) => {
  console.log("GET BLOGS BY USER ID");
};

const createBlog = async (req, res, next) => {
  console.log("POST A NEW BLOG");
};

const updateBlog = async (req, res, next) => {
  console.log("UPDATE/EDIT BLOG");
};

const deleteBlog = async (req, res, next) => {
  console.log("DELETE BLOG");
};

exports.getAllBlogs = getAllBlogs;
exports.getBlogsById = getBlogsById;
exports.getBlogsByUserId = getBlogsByUserId;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
