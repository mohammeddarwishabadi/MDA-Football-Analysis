import Image from 'next/image';

const StatusBadge = ({ status }) => {
  const isLive = ['1H', '2H', 'ET', 'P', 'BT', 'HT'].includes(status?.short);
  const isFinished = status?.short === 'FT';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
      isLive ? 'bg-accent text-black' : isFinished ? 'bg-white/10 text-muted' : 'bg-white/5 text-muted'
    }`}>
      {isLive ? `LIVE ${status.elapsed ?? ''}'` : status?.long ?? 'Scheduled'}
    </span>
  );
};

export default function MatchStatsCard({ match, stats }) {
  if (match) {
    const { teams, goals, status, league } = match;
    const home = stats?.find(s => s.team === teams.home.name);
    const away = stats?.find(s => s.team === teams.away.name);

    return (
      <div className="card space-y-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{league.name} · {league.round}</span>
          <StatusBadge status={status} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-1 flex-1 text-center">
            {teams.home.logo && (
              <Image src={teams.home.logo} alt={teams.home.name} width={36} height={36} unoptimized />
            )}
            <span className="text-sm font-semibold">{teams.home.name}</span>
          </div>

          <div className="text-3xl font-heading font-bold tracking-widest text-accent">
            {goals.home ?? '-'} – {goals.away ?? '-'}
          </div>

          <div className="flex flex-col items-center gap-1 flex-1 text-center">
            {teams.away.logo && (
              <Image src={teams.away.logo} alt={teams.away.name} width={36} height={36} unoptimized />
            )}
            <span className="text-sm font-semibold">{teams.away.name}</span>
          </div>
        </div>

        {home && away && (
          <div className="text-xs text-muted grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
            <div className="text-center">
              <div className="font-semibold text-white">{home.shots ?? '-'}</div>
              <div>Shots</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-white">{home.possession ?? '-'}</div>
              <div>Poss (H)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-white">{away.shots ?? '-'}</div>
              <div>Shots (A)</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const teams = match?.teams ? [match.teams.home.name, match.teams.away.name] : (stats?.teams ?? ['Team A', 'Team B']);
  const s = stats?.stats ?? {};
  return (
    <div className="card">
      <h3 className="font-heading text-xl font-bold mb-4">{teams[0]} vs {teams[1]}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        <div className="p-3 bg-black/20 rounded">xG: {s.xG ?? `${s.xgHome ?? '-'} – ${s.xgAway ?? '-'}`}</div>
        <div className="p-3 bg-black/20 rounded">Shots: {s.shots ?? `${s.shotsHome ?? '-'} – ${s.shotsAway ?? '-'}`}</div>
        <div className="p-3 bg-black/20 rounded">Possession: {s.possession ?? `${s.possessionHome ?? '-'} – ${s.possessionAway ?? '-'}`}</div>
      </div>
    </div>
  );
}
