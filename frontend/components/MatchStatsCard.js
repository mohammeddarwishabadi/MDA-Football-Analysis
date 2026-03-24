import Image from 'next/image';
import Link from 'next/link';

const STATUS_LIVE = new Set(['1H', '2H', 'ET', 'P', 'BT', 'HT']);

function LivePing() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
    </span>
  );
}

function StatBar({ label, homeVal, awayVal, homeRaw, awayRaw, gold }) {
  const h = parseFloat(homeRaw) || 0;
  const a = parseFloat(awayRaw) || 0;
  const total = h + a || 1;
  const homePct = Math.round((h / total) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={gold ? 'text-gold font-semibold' : 'text-accent font-semibold'}>{homeVal ?? '—'}</span>
        <span className="text-white/40 uppercase tracking-widest text-[10px]">{label}</span>
        <span className="text-white/70 font-semibold">{awayVal ?? '—'}</span>
      </div>
      <div className="stat-bar-track">
        <div className={gold ? 'stat-bar-fill-gold' : 'stat-bar-fill-green'} style={{ width: `${homePct}%` }} />
      </div>
    </div>
  );
}

export default function MatchStatsCard({ match, stats }) {
  if (!match) return null;

  const { teams, goals, status, league } = match;
  const isLive = STATUS_LIVE.has(status?.short);
  const isFinished = status?.short === 'FT';
  const home = stats?.find(s => s.team === teams.home.name);
  const away = stats?.find(s => s.team === teams.away.name);

  const cardContent = (
    <div className="card-tactical flex flex-col gap-4 p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
        <span className="text-white/40 truncate">{league.country} · {league.name}</span>
        <span className={`flex items-center gap-1.5 font-bold ${isLive ? 'text-accent' : isFinished ? 'text-white/40' : 'text-white/25'}`}>
          {isLive && <LivePing />}
          {isLive ? `${status.elapsed ?? ''}'` : isFinished ? 'FT' : status?.long ?? 'SCH'}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center justify-between gap-3">
        <TeamBlock team={teams.home} />
        <div className="flex flex-col items-center shrink-0">
          <div className="font-heading text-4xl font-black tracking-widest leading-none"
            style={{ color: '#F4D03F', textShadow: '0 0 16px rgba(244,208,63,0.5)' }}>
            {goals.home ?? '-'}&nbsp;–&nbsp;{goals.away ?? '-'}
          </div>
          {isLive && <span className="mt-1 text-[10px] text-accent/70 uppercase tracking-widest">Live</span>}
        </div>
        <TeamBlock team={teams.away} right />
      </div>

      <p className="text-center text-[10px] text-white/25 uppercase tracking-widest -mt-1">{league.round}</p>

      {/* Stat bars */}
      {home && away && (
        <div className="border-t border-white/5 pt-3 space-y-3">
          <StatBar label="Possession" homeVal={home.possession} awayVal={away.possession} homeRaw={parseFloat(home.possession)} awayRaw={parseFloat(away.possession)} />
          <StatBar label="Shots" homeVal={home.shots} awayVal={away.shots} homeRaw={home.shots} awayRaw={away.shots} gold />
          <StatBar label="On Target" homeVal={home.shotsOnTarget} awayVal={away.shotsOnTarget} homeRaw={home.shotsOnTarget} awayRaw={away.shotsOnTarget} />
        </div>
      )}

      {/* Deep stats link */}
      <div className="mt-auto pt-2 border-t border-white/5 text-center">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(0,255,65,0.4)' }}>
          Tap for match centre →
        </span>
      </div>
    </div>
  );

  return (
    <Link href={`/match/${match.id}`} className="block h-full hover:opacity-90 transition-opacity">
      {cardContent}
    </Link>
  );
}

function TeamBlock({ team, right }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 flex-1 ${right ? 'items-end' : 'items-start'}`}>
      {team.logo && (
        <div className="relative w-9 h-9">
          <Image src={team.logo} alt={team.name} fill className="object-contain" unoptimized />
        </div>
      )}
      <span className="text-xs font-semibold text-white/80 text-center leading-tight">{team.name}</span>
    </div>
  );
}
