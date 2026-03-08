require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');
const Prediction = require('../src/models/Prediction');
const Comment = require('../src/models/Comment');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([User.deleteMany(), Post.deleteMany(), Prediction.deleteMany(), Comment.deleteMany()]);

  const adminPassword = await bcrypt.hash('admin12345', 12);
  const userPassword = await bcrypt.hash('user12345', 12);

  const [admin, user1, user2] = await User.insertMany([
    {
      name: 'MDA Admin',
      email: 'admin@mda.com',
      password: adminPassword,
      role: 'admin',
      subscription: 'premium'
    },
    {
      name: 'MDA User One',
      email: 'user1@mda.com',
      password: userPassword,
      role: 'user',
      subscription: 'free'
    },
    {
      name: 'MDA User Two',
      email: 'user2@mda.com',
      password: userPassword,
      role: 'user',
      subscription: 'premium'
    }
  ]);

  const [post] = await Post.insertMany([
    {
      title: 'Arsenal 2-1 Liverpool: Pressing Traps Won the Midfield',
      match: 'Premier League - Matchday 24',
      teams: ['Arsenal', 'Liverpool'],
      stats: { xG: '1.93 - 1.21', shots: '14 - 9', possession: '56% - 44%' },
      xg: '1.93 - 1.21',
      shots: '14 - 9',
      possession: '56% - 44%',
      analysis_text: 'Arsenal forced six high turnovers in key zones.',
      charts: ['xg-bar.png'],
      imageUrl: '/uploads/posts/2026-01/sample-analysis.png'
    }
  ]);

  await Prediction.insertMany([
    {
      match: 'Manchester City vs Chelsea',
      teams: ['Manchester City', 'Chelsea'],
      win_probability: [64, 19, 17],
      expected_goals: [2.1, 1.0],
      confidence: 82,
      charts: ['probability-distribution.png'],
      imageUrl: '/uploads/predictions/2026-01/sample-prediction.png'
    }
  ]);

  await Comment.create({
    user: user1._id,
    post: post._id,
    content: 'Great breakdown. The midfield press was the turning point.'
  });

  await Comment.create({
    user: user2._id,
    post: post._id,
    content: 'Would love to see the same model applied to away fixtures.'
  });

  console.log('Seed complete: admin@mda.com/admin12345, user1@mda.com/user12345, user2@mda.com/user12345');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
