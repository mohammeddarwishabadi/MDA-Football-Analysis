const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  firstname: user.firstname,
  lastname: user.lastname,
  email: user.email,
  role: user.role,
  subscription: user.subscription,
  createdAt: user.createdAt
});

const signToken = (user) => jwt.sign(
  { id: user._id, role: user.role, subscription: user.subscription },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

exports.register = asyncHandler(async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: 'Username, firstname, lastname, email and password are required' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const [emailExists, usernameExists] = await Promise.all([
    User.findOne({ email: email.toLowerCase() }),
    User.findOne({ username: username.trim().toLowerCase() })
  ]);

  if (emailExists) return res.status(409).json({ message: 'Email already registered' });
  if (usernameExists) return res.status(409).json({ message: 'Username already taken' });

  const hash = await bcrypt.hash(password, 12);

  const user = await User.create({
    username: username.trim().toLowerCase(),
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    email: email.toLowerCase(),
    password: hash,
    role: 'user',
    subscription: 'free'
  });

  const token = signToken(user);
  return res.status(201).json({ token, user: toPublicUser(user) });
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

  const token = signToken(user);
  return res.json({ token, user: toPublicUser(user) });
});

exports.me = asyncHandler(async (req, res) => {
  return res.json({ user: toPublicUser(req.user) });
});
