const express = require("express");

const router = express.Router();

const blogControllers = require('../Controllers/Blog-controllers');

router.get('/',blogControllers.getAllBlogs);

router.get('/:pid',blogControllers.getBlogsById);

router.get('/user/:uid',blogControllers.getBlogsByUserId);

router.post('/create',blogControllers.createBlog);

router.patch('/:pid',blogControllers.updateBlog);

router.delete('/:pid',blogControllers.deleteBlog);

module.exports = router;