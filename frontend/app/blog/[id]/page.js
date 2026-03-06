import ChartSection from '@/components/ChartSection';
import ErrorBanner from '@/components/ErrorBanner';
import MatchStatsCard from '@/components/MatchStatsCard';
import { apiBase, buildImageUrl } from '@/lib/api';

async function getPost(id) {
  const res = await fetch(`${apiBase}/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    return { error: 'Post not found or currently unavailable.' };
  }
  const post = await res.json();
  return { post };
}

export default async function SinglePostPage({ params }) {
  const { post, error } = await getPost(params.id);

  if (error) {
    return <ErrorBanner message={error} />;
  }

  return (
    <article className="space-y-6">
      <div className="card space-y-3">
        <p className="text-xs uppercase tracking-wider text-accent">{post.match}</p>
        <h1 className="font-heading font-bold text-3xl">{post.title}</h1>
        {post.imageUrl && <img src={buildImageUrl(post.imageUrl)} alt={post.title} className="w-full max-h-[420px] object-cover rounded-lg border border-white/10" />}
        <p className="text-muted">Teams: {(post.teams || []).join(' vs ')}</p>
        <p className="leading-relaxed text-slate-200">{post.analysis_text}</p>
      </div>

      <MatchStatsCard post={post} />

      <section className="card space-y-3">
        <h2 className="font-heading text-2xl font-bold">Technical Fields</h2>
        <p><span className="text-muted">xG:</span> {post.xg || '-'}</p>
        <p><span className="text-muted">Charts:</span> {(post.charts || []).join(', ') || 'None'}</p>
      </section>

      {(post.charts || []).length > 0 && (
        <section>
          <h2 className="section-title">Post Charts</h2>
          <ChartSection />
        </section>
      )}
    </article>
  );
}
