const axios = require('axios');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

const apiFootball = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY }
});

const normalisedMatch = (fixture) => ({
  id: fixture.fixture.id,
  date: fixture.fixture.date,
  status: {
    long: fixture.fixture.status.long,
    short: fixture.fixture.status.short,
    elapsed: fixture.fixture.status.elapsed
  },
  league: {
    name: fixture.league.name,
    country: fixture.league.country,
    logo: fixture.league.logo,
    round: fixture.league.round
  },
  teams: {
    home: { name: fixture.teams.home.name, logo: fixture.teams.home.logo },
    away: { name: fixture.teams.away.name, logo: fixture.teams.away.logo }
  },
  goals: { home: fixture.goals.home, away: fixture.goals.away }
});

exports.getTodayMatches = asyncHandler(async (req, res) => {
  if (!process.env.API_FOOTBALL_KEY) {
    return sendError(res, 'API_FOOTBALL_KEY is not configured', 503);
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data } = await apiFootball.get('/fixtures', { params: { date: today } });

  if (!data || !Array.isArray(data.response)) {
    return sendError(res, 'Unexpected response from football API', 502);
  }

  const matches = data.response.map(normalisedMatch);
  return sendSuccess(res, matches, `${matches.length} matches found for ${today}`);
});

exports.getLiveMatches = asyncHandler(async (req, res) => {
  if (!process.env.API_FOOTBALL_KEY) {
    return sendError(res, 'API_FOOTBALL_KEY is not configured', 503);
  }

  const { data } = await apiFootball.get('/fixtures', { params: { live: 'all' } });

  if (!data || !Array.isArray(data.response)) {
    return sendError(res, 'Unexpected response from football API', 502);
  }

  const matches = data.response.map(normalisedMatch);
  return sendSuccess(res, matches, `${matches.length} live matches`);
});

exports.getMatchStats = asyncHandler(async (req, res) => {
  if (!process.env.API_FOOTBALL_KEY) {
    return sendError(res, 'API_FOOTBALL_KEY is not configured', 503);
  }

  const { fixtureId } = req.params;
  const { data } = await apiFootball.get('/fixtures/statistics', {
    params: { fixture: fixtureId }
  });

  if (!data || !Array.isArray(data.response)) {
    return sendError(res, 'Unexpected response from football API', 502);
  }

  const extract = (teamStats, key) => {
    const stat = teamStats.statistics.find((s) => s.type === key);
    return stat ? stat.value : null;
  };

  const stats = data.response.map((teamStats) => ({
    team: teamStats.team.name,
    logo: teamStats.team.logo,
    shots: extract(teamStats, 'Total Shots'),
    shotsOnTarget: extract(teamStats, 'Shots on Goal'),
    possession: extract(teamStats, 'Ball Possession'),
    passes: extract(teamStats, 'Total passes'),
    corners: extract(teamStats, 'Corner Kicks'),
    fouls: extract(teamStats, 'Fouls'),
    yellowCards: extract(teamStats, 'Yellow Cards'),
    redCards: extract(teamStats, 'Red Cards')
  }));

  return sendSuccess(res, stats, 'Match statistics');
});
