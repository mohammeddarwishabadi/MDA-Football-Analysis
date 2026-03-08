'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import PredictionCard from '@/components/PredictionCard';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorBanner from '@/components/ErrorBanner';
import { apiRequest } from '@/lib/api';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [preds, setPreds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [postsPayload, predsPayload] = await Promise.all([
          apiRequest('/posts?page=1&limit=3'),
          apiRequest('/predictions?page=1&limit=3')
        ]);
        setPosts(postsPayload.data || []);
        setPreds(predsPayload.data || []);
      } catch (err) {
        setError(err.message || 'Error loading landing page data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-14">
      <section className="card text-center space-y-5 shadow-glow">
        <h1 className="font-heading text-4xl md:text-5xl font-bold">Football Match Analysis & AI Predictions</h1>
        <p className="text-muted max-w-2xl mx-auto">Tactical analysis, match statistics, and AI-powered predictions.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/analysis" className="bg-accent text-black font-semibold px-5 py-3 rounded">Explore Analysis</Link>
          <Link href="/predictions" className="border border-accent text-accent font-semibold px-5 py-3 rounded">View Predictions</Link>
          <Link href="/admin/login" className="border border-white/20 px-5 py-3 rounded">Login</Link>
          <Link href="/auth/register" className="border border-white/20 px-5 py-3 rounded">Register</Link>
        </div>
      </section>

      <ErrorBanner message={error} />

      <section>
        <h2 className="section-title">Latest Analysis</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </section>

      <section>
        <h2 className="section-title">Latest Predictions</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`p-${i}`} />) : preds.map((prediction) => <PredictionCard key={prediction._id} prediction={prediction} />)}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <div className="card"><h3 className="font-heading font-bold mb-2">Tactical Intelligence</h3><p className="text-muted">Clear match breakdowns from shape, press, and transition analysis.</p></div>
        <div className="card"><h3 className="font-heading font-bold mb-2">Data-Driven Stats</h3><p className="text-muted">xG, shots, possession and visual charts in one platform.</p></div>
        <div className="card"><h3 className="font-heading font-bold mb-2">Premium AI Predictions</h3><p className="text-muted">Advanced prediction models for subscribed members.</p></div>
      </section>

      <section className="card text-center space-y-3">
        <h2 className="font-heading text-3xl font-bold">Start your football analytics journey</h2>
        <p className="text-muted">Create your free account and unlock match insights instantly.</p>
        <div><Link href="/auth/register" className="bg-accent text-black px-5 py-3 rounded font-semibold inline-block">Create Free Account</Link></div>
      </section>
    </div>
  );
}
