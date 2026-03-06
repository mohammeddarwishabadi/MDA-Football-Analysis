export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
      {message}
    </div>
  );
}
