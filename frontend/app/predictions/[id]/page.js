import ErrorBanner from '@/components/ErrorBanner';
import { apiBase, buildImageUrl } from '@/lib/api';

async function getPrediction(id) {
  const res = await fetch(`${apiBase}/predictions/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    return { error: 'Prediction not found or currently unavailable.' };
  }
  const prediction = await res.json();
  return { prediction };
}

export default async function SinglePredictionPage({ params }) {
  const { prediction, error } = await getPrediction(params.id);

  if (error) {
    return <ErrorBanner message={error} />;
  }

  const [home = 0, draw = 0, away = 0] = prediction.win_probability || [];

  return (
    <article className="space-y-6">
      <div className="card space-y-3">
        <h1 className="font-heading font-bold text-3xl">{prediction.match}</h1>
        {prediction.imageUrl && <img src={buildImageUrl(prediction.imageUrl)} alt={prediction.match} className="w-full max-h-[420px] object-cover rounded-lg border border-white/10" />}
        <p className="text-muted">Teams: {(prediction.teams || []).join(' vs ')}</p>
        <p>Expected Goals: {prediction.expected_goals?.[0]} - {prediction.expected_goals?.[1]}</p>
        <p>Confidence: {prediction.confidence}%</p>
      </div>

      <section className="card space-y-4">
        <h2 className="font-heading text-2xl font-bold">Probability Model</h2>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden flex">
          <div className="bg-accent" style={{ width: `${home}%` }} />
          <div className="bg-slate-500" style={{ width: `${draw}%` }} />
          <div className="bg-blue-500" style={{ width: `${away}%` }} />
        </div>
        <p className="text-muted">Home/Draw/Away: {home}% / {draw}% / {away}%</p>
        <p className="text-muted">Charts: {(prediction.charts || []).join(', ') || 'None'}</p>
      </section>
    </article>
  );
}
