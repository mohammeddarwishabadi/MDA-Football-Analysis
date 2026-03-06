'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import PostCard from '@/components/PostCard';
import PredictionCard from '@/components/PredictionCard';
import MatchStatsCard from '@/components/MatchStatsCard';
import ErrorBanner from '@/components/ErrorBanner';
import { analysisPosts as fallbackPosts, predictions as fallbackPredictions } from '@/lib/dummyData';
import { apiBase } from '@/lib/api';

export default function HomePage() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [preds, setPreds] = useState(fallbackPredictions);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [postsRes, predsRes] = await Promise.all([
          fetch(`${apiBase}/posts?page=1&limit=2`, { cache: 'no-store' }),
          fetch(`${apiBase}/predictions?page=1&limit=2`, { cache: 'no-store' })
        ]);

        if (postsRes.ok) {
          const postsPayload = await postsRes.json();
          setPosts(postsPayload.data || fallbackPosts);
        }

        if (predsRes.ok) {
          const predsPayload = await predsRes.json();
          setPreds(predsPayload.data || fallbackPredictions);
        }
      } catch {
        setError('Using fallback sample data while API is unavailable.');
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-10">
      <section className="card flex flex-col md:flex-row items-center gap-8 shadow-glow">
        <Image src="/logo.svg" alt="MDA Logo" width={180} height={180} className="rounded-xl border border-accent/30" />
        <div>
          <PageIntro title="MDA | Football Analysis" subtitle="Football truth through data" />
          <Link href="/analysis" className="inline-block bg-accent text-black font-bold px-5 py-3 rounded-lg hover:opacity-90 transition">
            Explore Match Analysis
          </Link>
        </div>
      </section>

      <ErrorBanner message={error} />

      <section>
        <h2 className="section-title">Featured Analysis Posts</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {posts.map((post) => <PostCard key={post._id || post.id} post={post} />)}
        </div>
      </section>

      <section>
        <h2 className="section-title">Latest Predictions</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {preds.map((p) => <PredictionCard key={p._id || p.id} prediction={p} />)}
        </div>
      </section>

      <section>
        <h2 className="section-title">Recent Statistics</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {posts.map((post) => <MatchStatsCard key={`${post._id || post.id}-stats`} post={post} />)}
        </div>
      </section>
    </div>
  );
}
