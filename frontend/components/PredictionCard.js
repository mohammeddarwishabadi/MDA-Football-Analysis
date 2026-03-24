import Link from 'next/link';
import { buildImageUrl } from '@/lib/api';

export default function PredictionCard({ prediction, compact }) {
  const [home = 0, draw = 0, away = 0] = prediction.win_probability || prediction.winProbability || [];
  const xgHome = prediction.expected_goals?.[0] ?? prediction.expectedGoals?.[0];
  const xgAway = prediction.expected_goals?.[1] ?? prediction.expectedGoals?.[1];
  const teams = prediction.teams || [];

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {prediction.imageUrl && !compact && (
        <img src={buildImageUrl(prediction.imageUrl)} alt={prediction.match} className="w-full h-40 object-cover" />
      )}

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-base leading-snug">{prediction.match}</h3>
          {prediction.confidence != null && (
            <span
              className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(244,208,63,0.15)', color: '#F4D03F' }}
            >
              {prediction.confidence}% conf.
            </span>
          )}
        </div>

        {/* Win probability bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-white/50">
            <span>{teams[0] || 'Home'}</span>
            <span>Draw</span>
            <span>{teams[1] || 'Away'}</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden flex gap-px" style={{ background: '#0D0D0D' }}>
            <div style={{ width: `${home}%`, background: '#00FF41', boxShadow: '0 0 6px rgba(0,255,65,0.5)' }} />
            <div style={{ width: `${draw}%`, background: '#555' }} />
            <div style={{ width: `${away}%`, background: '#F4D03F', boxShadow: '0 0 6px rgba(244,208,63,0.4)' }} />
          </div>
          <div className="flex justify-between text-[11px] font-semibold">
            <span style={{ color: '#00FF41' }}>{home}%</span>
            <span className="text-white/30">{draw}%</span>
            <span style={{ color: '#F4D03F' }}>{away}%</span>
          </div>
        </div>

        {/* xG */}
        {(xgHome != null || xgAway != null) && (
          <p className="text-xs text-white/40">
            xG Model: <span className="text-white/70">{xgHome ?? '—'}</span> – <span className="text-white/70">{xgAway ?? '—'}</span>
          </p>
        )}

        {prediction._id && !compact && (
          <div className="mt-auto pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <Link href={`/predictions/${prediction._id}`} className="text-xs font-bold uppercase tracking-wider" style={{ color: '#00FF41' }}>
              View Details →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
