import Link from 'next/link';
import { buildImageUrl } from '@/lib/api';

const FALLBACK_IMG = null;

const CATEGORY_COLORS = {
  'Tactical Board': { bg: 'rgba(0,255,65,0.12)', color: '#00FF41' },
  'Post-Match':     { bg: 'rgba(244,208,63,0.12)', color: '#F4D03F' },
  'Scouting':       { bg: 'rgba(100,160,255,0.12)', color: '#6EB5FF' },
  'Analysis':       { bg: 'rgba(0,255,65,0.12)', color: '#00FF41' }
};

function inferCategory(post) {
  const text = `${post.title} ${post.analysis_text || ''}`.toLowerCase();
  if (text.includes('scout') || text.includes('player')) return 'Scouting';
  if (text.includes('tactical') || text.includes('press') || text.includes('shape')) return 'Tactical Board';
  if (post.match) return 'Post-Match';
  return 'Analysis';
}

export default function PostCard({ post, featured }) {
  const href = post._id ? `/blog/${post._id}` : '#';
  const imgUrl = post.imageUrl ? buildImageUrl(post.imageUrl) : FALLBACK_IMG;
  const category = inferCategory(post);
  const catStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS['Analysis'];
  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;
  const excerpt = (post.analysis_text || post.insight || post.excerpt || '').slice(0, 110);

  return (
    <article
      className="group flex flex-col rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5"
      style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ height: featured ? '260px' : '180px', background: '#0D0D0D' }}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0D0D0D 0%, rgba(0,255,65,0.05) 100%)' }}
          >
            <span className="text-4xl opacity-20">⚽</span>
          </div>
        )}
        {/* Category pill */}
        <span
          className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: catStyle.bg, color: catStyle.color, backdropFilter: 'blur(8px)' }}
        >
          {category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 space-y-2.5">
        {post.match && (
          <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {post.match}
          </p>
        )}
        <h3 className="font-heading font-bold text-base leading-snug line-clamp-2">{post.title}</h3>
        {excerpt && (
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 mt-auto border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {date && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{date}</span>}
          {post._id && (
            <Link
              href={href}
              className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all"
              style={{ color: '#00FF41', border: '1px solid rgba(0,255,65,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,65,0.1)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,65,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Read More →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
