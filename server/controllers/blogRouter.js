const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (_req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('userId', { username: 1, name: 1 }); // userId references the field in the Blog model. Schema defines that the User model populates the userId field.
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

blogRouter.post('/', async (req, res, next) => {
  try {
    // jwt.verify decodes the token: returns object { username, id } defined by jwt.sign (loginRouter.js).
    // decoded token object contains username and id of user currently logged in.
    const decodedToken = jwt.verify(req.token, process.env.SECRET); // req.token comes from tokenExtractor
    if (!decodedToken.id) {
      return res.status(401).json({
        error: 'Token missing or invalid.'
      });
    }
    const user = await User.findById(decodedToken.id);
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
    const decodedToken = jwt.verify(req.token, process.env.SECRET); // req.token comes from tokenExtractor
    const blog = await Blog.findById(req.params.id);
    if (blog === null) {
      return res.status(204).end();
    }
    if (blog.userId.toString() !== decodedToken.id.toString()) {
      return res.status(401).json({
        error: 'Token missing or invalid'
      });
    }
    
    const user = await User.findById(decodedToken.id);
    user.blogs.pull(blog._id);
    await user.save();
    
    await Blog.findByIdAndDelete(req.params.id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

blogRouter.put('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const blogToBeUpdated = await Blog.findById(req.params.id);
    if (!decodedToken.id || decodedToken.id.toString() !== blogToBeUpdated.userId.toString()) {
      return res.status(401).json({
        error: 'Token missing or invalid.'
      });
    }
    const updatedDetails = {
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes,
      userId: req.body.userId
    };
    const updatedBlog
      = await Blog.findByIdAndUpdate(req.params.id, updatedDetails, { new: true });
    res.json(updatedBlog);
  } catch (err) {
    next(err);
  }
});

module.exports = blogRouter;
