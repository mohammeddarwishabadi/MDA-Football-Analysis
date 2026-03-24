const express = require('express');
const { getTodayMatches, getLiveMatches, getFixtureById, getMatchStats } = require('../controllers/matchController');

const router = express.Router();

router.get('/today', getTodayMatches);
router.get('/live', getLiveMatches);
router.get('/fixture/:fixtureId', getFixtureById);
router.get('/stats/:fixtureId', getMatchStats);

module.exports = router;
