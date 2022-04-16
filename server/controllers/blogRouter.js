const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

blogRouter.post('/', async (req, res, next) => {
  try {
    const newBlog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes || 0
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    next(err);
  }
});

module.exports = blogRouter;
