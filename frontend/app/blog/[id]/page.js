import ChartSection from '@/components/ChartSection';
import ErrorBanner from '@/components/ErrorBanner';
import MatchStatsCard from '@/components/MatchStatsCard';
import MatchStatsCharts from '@/components/MatchStatsCharts';
import PostComments from '@/components/PostComments';
import { apiBase, buildImageUrl } from '@/lib/api';

async function fetchPost(id) {
  const res = await fetch(`${apiBase}/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const payload = await res.json();
  return payload?.data || null;
}

export async function generateMetadata({ params }) {
  const post = await fetchPost(params.id);
  const title = post ? `${post.title} | MDA Blog` : 'Post Not Found | MDA Blog';
  const description = post?.analysis_text?.slice(0, 160) || 'Football match analysis and insights from MDA.';
  const image = post?.imageUrl ? buildImageUrl(post.imageUrl) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: image ? [image] : []
    }
  };
}

export default async function SinglePostPage({ params }) {
  const post = await fetchPost(params.id);

  if (!post) {
    return <ErrorBanner message="Post not found or currently unavailable." />;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.analysis_text,
    datePublished: post.createdAt,
    image: post.imageUrl ? [buildImageUrl(post.imageUrl)] : [],
    author: { '@type': 'Organization', name: 'MDA | Football Analysis' }
  };

  return (
    <article className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="card space-y-3">
        <p className="text-xs uppercase tracking-wider text-accent">{post.match}</p>
        <h1 className="font-heading font-bold text-3xl">{post.title}</h1>
        {post.imageUrl && <img src={buildImageUrl(post.imageUrl)} alt={post.title} className="w-full max-h-[420px] object-cover rounded-lg border border-white/10" />}
        <p className="text-muted">Teams: {(post.teams || []).join(' vs ')}</p>
        <p className="leading-relaxed text-slate-200">{post.analysis_text}</p>
      </div>

      <MatchStatsCard post={post} />
      <MatchStatsCharts post={post} />

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

      <PostComments postId={params.id} />
    </article>
  );
}
