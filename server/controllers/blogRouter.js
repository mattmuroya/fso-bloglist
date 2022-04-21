const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('userId', { username: 1, name: 1 }) ;
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

blogRouter.post('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    const newBlog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes || 0,
      userId: user._id
    });
    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(newBlog._id);
    await user.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    next(err);
  }
});

blogRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

blogRouter.put('/:id', async (req, res, next) => {
  try {
    const updatedDetails = {
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes,
      userId: req.body.userId
    };
    const updatedNote
      = await Blog.findByIdAndUpdate(req.params.id, updatedDetails, { new: true });
    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
});

module.exports = blogRouter;
