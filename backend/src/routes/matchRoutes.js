const express = require('express');
const { getTodayMatches, getLiveMatches, getMatchStats } = require('../controllers/matchController');

const router = express.Router();

router.get('/today', getTodayMatches);
router.get('/live', getLiveMatches);
router.get('/stats/:fixtureId', getMatchStats);

module.exports = router;
