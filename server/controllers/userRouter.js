const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 });
  res.json(users);
});

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (username === undefined || password === undefined) {
    return res.status(400).json({
      error: 'Username and password required.'
    });
  }

  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({
      error: 'Username and password must be at least 3 characters.'
    });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({
      error: 'Username already exists.'
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = userRouter;
