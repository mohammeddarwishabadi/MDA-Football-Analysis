import Link from 'next/link';
import { buildImageUrl } from '@/lib/api';

export default function PredictionCard({ prediction }) {
  const [home = 0, draw = 0, away = 0] = prediction.win_probability || prediction.winProbability || [];

  return (
    <div className="card space-y-3">
      {prediction.imageUrl && (
        <img src={buildImageUrl(prediction.imageUrl)} alt={prediction.match} className="w-full h-44 object-cover rounded-lg border border-white/10" />
      )}
      <h3 className="font-heading font-bold text-xl">{prediction.match}</h3>
      <p className="text-muted">xG Model: {prediction.expected_goals?.[0] ?? prediction.expectedGoals?.[0]} - {prediction.expected_goals?.[1] ?? prediction.expectedGoals?.[1]}</p>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
        <div className="bg-accent" style={{ width: `${home}%` }} />
        <div className="bg-slate-500" style={{ width: `${draw}%` }} />
        <div className="bg-blue-500" style={{ width: `${away}%` }} />
      </div>
      <p className="text-sm text-muted">Win/Draw/Loss: {home}% / {draw}% / {away}% · Confidence: {prediction.confidence}%</p>
      {prediction._id && (
        <Link className="text-accent text-sm hover:underline" href={`/predictions/${prediction._id}`}>
          View prediction details →
        </Link>
      )}
    </div>
  );
}
