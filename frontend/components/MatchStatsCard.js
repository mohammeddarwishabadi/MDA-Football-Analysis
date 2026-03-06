export default function MatchStatsCard({ post }) {
  const teams = post.teams || ['Team A', 'Team B'];
  const stats = post.stats || {};

  return (
    <div className="card">
      <h3 className="font-heading text-xl font-bold mb-4">{teams[0]} vs {teams[1]}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        <div className="p-3 bg-black/20 rounded">xG: {stats.xG || `${stats.xgHome ?? post.xg ?? '-'}${stats.xgAway ? ` - ${stats.xgAway}` : ''}`}</div>
        <div className="p-3 bg-black/20 rounded">Shots: {stats.shots || `${stats.shotsHome ?? post.shots ?? '-'}${stats.shotsAway ? ` - ${stats.shotsAway}` : ''}`}</div>
        <div className="p-3 bg-black/20 rounded">Possession: {stats.possession || `${stats.possessionHome ?? post.possession ?? '-'}${stats.possessionAway ? ` - ${stats.possessionAway}` : ''}`}</div>
      </div>
    </div>
  );
}
