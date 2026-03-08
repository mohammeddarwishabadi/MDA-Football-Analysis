const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  subscription: user.subscription,
  createdAt: user.createdAt
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password: hash,
    role: 'user',
    subscription: 'free'
  });

  res.status(201).json({ user: toPublicUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role, subscription: user.subscription }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ token, user: toPublicUser(user) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});
