export const analysisPosts = [
  {
    id: 'ars-liv-1',
    title: 'Arsenal 2-1 Liverpool: Pressing Traps Won the Midfield',
    match: 'Premier League - Matchday 24',
    teams: ['Arsenal', 'Liverpool'],
    stats: { xgHome: 1.93, xgAway: 1.21, shotsHome: 14, shotsAway: 9, possessionHome: 56, possessionAway: 44 },
    insight:
      'Arsenal forced six high turnovers in the right half-space, generating 0.62 xG from sequences under 10 seconds.'
  },
  {
    id: 'rm-bar-1',
    title: 'Real Madrid 1-1 Barcelona: Controlled Chaos in Transition',
    match: 'La Liga - El Clasico',
    teams: ['Real Madrid', 'Barcelona'],
    stats: { xgHome: 1.34, xgAway: 1.47, shotsHome: 11, shotsAway: 13, possessionHome: 48, possessionAway: 52 },
    insight: 'Barcelona had better territory, but Madrid generated the better shot quality after regains.'
  }
];

export const predictions = [
  {
    id: 'city-che',
    match: 'Manchester City vs Chelsea',
    teams: ['Manchester City', 'Chelsea'],
    winProbability: [64, 19, 17],
    expectedGoals: [2.1, 1.0],
    confidence: 82
  },
  {
    id: 'inter-milan',
    match: 'Inter vs AC Milan',
    teams: ['Inter', 'AC Milan'],
    winProbability: [43, 28, 29],
    expectedGoals: [1.6, 1.4],
    confidence: 71
  }
];

export const blogPosts = [
  {
    id: 'ppda-guide',
    title: 'How PPDA Reveals Pressing Identity',
    excerpt: 'A practical framework to analyze and compare pressing systems across top leagues.',
    date: '2026-02-10'
  },
  {
    id: 'xg-overperform',
    title: 'When xG Overperformance Is Sustainable',
    excerpt: 'Separating finishing variance from repeatable shot creation patterns.',
    date: '2026-02-15'
  }
];
