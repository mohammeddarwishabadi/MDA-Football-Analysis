export default function Toast({ message, type = 'success' }) {
  if (!message) return null;
  const cls = type === 'error'
    ? 'border-red-400/40 bg-red-500/10 text-red-200'
    : 'border-accent/40 bg-accent/10 text-accent';

  return <div className={`rounded-lg border px-4 py-3 text-sm ${cls}`}>{message}</div>;
}
