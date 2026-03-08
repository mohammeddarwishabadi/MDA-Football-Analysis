'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import ProtectedRoute from '@/components/ProtectedRoute';
import Toast from '@/components/Toast';
import SkeletonCard from '@/components/SkeletonCard';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const initialPost = { title: '', match: '', teams: '', analysis_text: '', xg: '', shots: '', possession: '', charts: '' };
const initialPrediction = { match: '', teams: '', win_probability: '', expected_goals: '', confidence: '', charts: '' };

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPosts: 0, totalPredictions: 0, totalUsers: 0, premiumUsers: 0, recentPosts: [], recentPredictions: [] });
  const [statsLoading, setStatsLoading] = useState(true);
  const [post, setPost] = useState(initialPost);
  const [prediction, setPrediction] = useState(initialPrediction);
  const [postImage, setPostImage] = useState(null);
  const [predictionImage, setPredictionImage] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    setError('');
    try {
      const payload = await apiRequest('/admin/stats');
      setStats(payload.data || {});
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardStats(); }, []);

  const uploadImage = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append('image', file);
    const payload = await apiRequest('/upload', { method: 'POST', body: fd, isFormData: true });
    return payload.data?.url;
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!post.title || !post.match || !post.teams || !post.analysis_text) {
      setError('Please complete required post fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    setToast({ message: '', type: 'success' });

    try {
      const payload = {
        ...post,
        teams: post.teams.split(',').map((v) => v.trim()).filter(Boolean),
        charts: post.charts.split(',').map((v) => v.trim()).filter(Boolean),
        stats: { xG: post.xg, shots: post.shots, possession: post.possession }
      };

      const uploaded = await uploadImage(postImage);
      if (uploaded) payload.imageUrl = uploaded;

      await apiRequest('/posts', { method: 'POST', body: payload });
      setToast({ message: 'Post created successfully', type: 'success' });
      setPost(initialPost);
      setPostImage(null);
      fetchDashboardStats();
    } catch (err) {
      setToast({ message: err.message || 'Error creating post', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const createPrediction = async (e) => {
    e.preventDefault();
    if (!prediction.match || !prediction.teams || !prediction.win_probability) {
      setError('Please complete required prediction fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    setToast({ message: '', type: 'success' });

    try {
      const payload = {
        ...prediction,
        teams: prediction.teams.split(',').map((v) => v.trim()).filter(Boolean),
        win_probability: prediction.win_probability.split(',').map((v) => Number(v.trim())).filter((v) => !Number.isNaN(v)),
        expected_goals: prediction.expected_goals.split(',').map((v) => Number(v.trim())).filter((v) => !Number.isNaN(v)),
        confidence: Number(prediction.confidence),
        charts: prediction.charts.split(',').map((v) => v.trim()).filter(Boolean)
      };

      const uploaded = await uploadImage(predictionImage);
      if (uploaded) payload.imageUrl = uploaded;

      await apiRequest('/predictions', { method: 'POST', body: payload });
      setToast({ message: 'Prediction created successfully', type: 'success' });
      setPrediction(initialPrediction);
      setPredictionImage(null);
      fetchDashboardStats();
    } catch (err) {
      setToast({ message: err.message || 'Error creating prediction', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageIntro title="Admin Dashboard" subtitle={`Welcome ${user?.firstname || user?.email || 'Admin'}`} />
      <ErrorBanner message={error} />
      <Toast message={toast.message} type={toast.type} />

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <StatsCard label="Total Posts" value={stats.totalPosts || 0} />
            <StatsCard label="Total Predictions" value={stats.totalPredictions || 0} />
            <StatsCard label="Users Count" value={stats.totalUsers || 0} />
            <StatsCard label="Premium Users" value={stats.premiumUsers || 0} />
          </>
        )}
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-heading text-xl font-bold mb-3">Recent Posts</h3>
          <ul className="space-y-2 text-sm">
            {(stats.recentPosts || []).map((item) => <li key={item._id}>{item.title} · {item.match} · {new Date(item.createdAt).toLocaleDateString()}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-heading text-xl font-bold mb-3">Recent Predictions</h3>
          <ul className="space-y-2 text-sm">
            {(stats.recentPredictions || []).map((item) => <li key={item._id}>{item.match} · {new Date(item.createdAt).toLocaleDateString()}</li>)}
          </ul>
        </div>
      </section>

      <section className="card flex flex-wrap gap-3 items-center">
        <Link href="/admin/posts" className="bg-accent text-black px-4 py-2 rounded font-semibold">Manage Posts</Link>
        <Link href="/admin/predictions" className="bg-accent text-black px-4 py-2 rounded font-semibold">Manage Predictions</Link>
      </section>

      <form onSubmit={createPost} className="card space-y-4">
        <h2 className="font-heading text-xl font-bold">Create Post</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2 font-semibold text-accent">Section 1 — Match Info</div>
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Title *" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Match *" value={post.match} onChange={(e) => setPost({ ...post, match: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Teams (comma-separated) *" value={post.teams} onChange={(e) => setPost({ ...post, teams: e.target.value })} />

          <div className="md:col-span-2 font-semibold text-accent">Section 2 — Tactical Analysis</div>
          <textarea className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" rows="6" placeholder="Analysis text *" value={post.analysis_text} onChange={(e) => setPost({ ...post, analysis_text: e.target.value })} />

          <div className="md:col-span-2 font-semibold text-accent">Section 3 — Match Statistics</div>
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="xG" value={post.xg} onChange={(e) => setPost({ ...post, xg: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Shots" value={post.shots} onChange={(e) => setPost({ ...post, shots: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Possession" value={post.possession} onChange={(e) => setPost({ ...post, possession: e.target.value })} />

          <div className="md:col-span-2 font-semibold text-accent">Section 4 — Optional Charts</div>
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Charts (comma-separated)" value={post.charts} onChange={(e) => setPost({ ...post, charts: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setPostImage(e.target.files?.[0] || null)} />
        </div>
        <button disabled={submitting} className="bg-accent text-black px-4 py-2 rounded font-semibold disabled:opacity-50">{submitting ? 'Submitting...' : 'Create Post'}</button>
      </form>

      <form onSubmit={createPrediction} className="card grid md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 font-heading text-xl font-bold">Create Prediction</h2>
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Match *" value={prediction.match} onChange={(e) => setPrediction({ ...prediction, match: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Teams (comma-separated) *" value={prediction.teams} onChange={(e) => setPrediction({ ...prediction, teams: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Win probability (home,draw,away) *" value={prediction.win_probability} onChange={(e) => setPrediction({ ...prediction, win_probability: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Expected goals (home,away)" value={prediction.expected_goals} onChange={(e) => setPrediction({ ...prediction, expected_goals: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Confidence %" value={prediction.confidence} onChange={(e) => setPrediction({ ...prediction, confidence: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Charts (comma-separated)" value={prediction.charts} onChange={(e) => setPrediction({ ...prediction, charts: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setPredictionImage(e.target.files?.[0] || null)} />
        <button disabled={submitting} className="bg-accent text-black px-4 py-2 rounded font-semibold md:col-span-2 disabled:opacity-50">{submitting ? 'Submitting...' : 'Create Prediction'}</button>
      </form>
    </div>
  );
}

function StatsCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-muted text-sm">{label}</p>
      <p className="text-3xl font-heading font-bold">{value}</p>
    </div>
  );
}
