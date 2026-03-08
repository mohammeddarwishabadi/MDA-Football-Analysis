import Link from 'next/link';
import { buildImageUrl } from '@/lib/api';

export default function PostCard({ post }) {
  const href = post._id ? `/blog/${post._id}` : '#';

  return (
    <article className="card space-y-3">
      {post.imageUrl && (
        <img src={buildImageUrl(post.imageUrl)} alt={post.title} className="w-full h-44 object-cover rounded-lg border border-white/10" />
      )}
      <p className="text-xs uppercase tracking-wider text-accent">{post.match || 'Analysis'}</p>
      <h3 className="font-heading font-bold text-xl">{post.title}</h3>
      <p className="text-muted">{post.insight || post.analysis_text || post.excerpt}</p>
      {post._id && (
        <Link className="text-accent text-sm hover:underline" href={href}>
          Read full analysis →
        </Link>
      )}
    </article>
  );
}
