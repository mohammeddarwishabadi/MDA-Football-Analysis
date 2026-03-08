const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendError, sendSuccess } = require('../utils/response');

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
    return sendError(res, 'Username, firstname, lastname, email and password are required', 400);
  }

  if (!emailRegex.test(email)) {
    return sendError(res, 'Invalid email format', 400);
  }

  if (password.length < 8) {
    return sendError(res, 'Password must be at least 8 characters', 400);
  }

  const [emailExists, usernameExists] = await Promise.all([
    User.findOne({ email: email.toLowerCase() }),
    User.findOne({ username: username.trim().toLowerCase() })
  ]);

  if (emailExists) return sendError(res, 'Email already registered', 409);
  if (usernameExists) return sendError(res, 'Username already taken', 409);

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
  return sendSuccess(res, { token, user: toPublicUser(user) }, 'Registration successful', 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return sendError(res, 'Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return sendError(res, 'Invalid credentials', 401);

  const token = signToken(user);
  return sendSuccess(res, { token, user: toPublicUser(user) }, 'Login successful');
});

exports.me = asyncHandler(async (req, res) => {
  return sendSuccess(res, toPublicUser(req.user), 'Current user fetched');
});
