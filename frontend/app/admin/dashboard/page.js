'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const initialPost = {
  title: '',
  match: '',
  teams: '',
  analysis_text: '',
  xg: '',
  shots: '',
  possession: '',
  charts: ''
};

const initialPrediction = {
  match: '',
  teams: '',
  win_probability: '',
  expected_goals: '',
  confidence: '',
  charts: ''
};

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute roles={['admin', 'editor']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalPredictions: 0,
    latestPost: '-',
    latestPrediction: '-'
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [post, setPost] = useState(initialPost);
  const [prediction, setPrediction] = useState(initialPrediction);
  const [postImage, setPostImage] = useState(null);
  const [predictionImage, setPredictionImage] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboardStats = async () => {
    setStatsLoading(true);
    setError('');

    try {
      const [postsFull, predictionsFull, latestPostRes, latestPredictionRes] = await Promise.all([
        apiRequest('/posts?page=1&limit=1'),
        apiRequest('/predictions?page=1&limit=1'),
        apiRequest('/posts?page=1&limit=1'),
        apiRequest('/predictions?page=1&limit=1')
      ]);

      setStats({
        totalPosts: postsFull.pagination?.total || 0,
        totalPredictions: predictionsFull.pagination?.total || 0,
        latestPost: latestPostRes.data?.[0]?.title || '-',
        latestPrediction: latestPredictionRes.data?.[0]?.match || '-'
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const uploadImage = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append('image', file);
    const payload = await apiRequest('/upload', {
      method: 'POST',
      body: fd,
      isFormData: true
    });
    return payload.url;
  };

  const createPost = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setSubmitting(true);

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
      setStatus('Post created successfully.');
      setPost(initialPost);
      setPostImage(null);
      fetchDashboardStats();
    } catch (err) {
      setError(err.message || 'Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  const createPrediction = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setSubmitting(true);

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
      setStatus('Prediction created successfully.');
      setPrediction(initialPrediction);
      setPredictionImage(null);
      fetchDashboardStats();
    } catch (err) {
      setError(err.message || 'Failed to create prediction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageIntro title="Admin Dashboard" subtitle={`Welcome ${user?.email || 'admin'} · role: ${user?.role || '-'}`} />

      <ErrorBanner message={error} />
      {status && <p className="text-accent">{status}</p>}

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-muted text-sm">Total Posts</p>
          <p className="text-3xl font-heading font-bold">{statsLoading ? '...' : stats.totalPosts}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">Total Predictions</p>
          <p className="text-3xl font-heading font-bold">{statsLoading ? '...' : stats.totalPredictions}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">Latest Post</p>
          <p className="font-semibold">{statsLoading ? 'Loading...' : stats.latestPost}</p>
        </div>
        <div className="card">
          <p className="text-muted text-sm">Latest Prediction</p>
          <p className="font-semibold">{statsLoading ? 'Loading...' : stats.latestPrediction}</p>
        </div>
      </section>

      <section className="card flex flex-wrap gap-3 items-center">
        <Link href="/admin/posts" className="bg-accent text-black px-4 py-2 rounded font-semibold">Manage Posts</Link>
        <Link href="/admin/predictions" className="bg-accent text-black px-4 py-2 rounded font-semibold">Manage Predictions</Link>
      </section>

      <form onSubmit={createPost} className="card grid md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 font-heading text-xl font-bold">Create Analysis Post</h2>
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} required />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Match" value={post.match} onChange={(e) => setPost({ ...post, match: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Teams (comma-separated)" value={post.teams} onChange={(e) => setPost({ ...post, teams: e.target.value })} />
        <textarea className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" rows="4" placeholder="Analysis text" value={post.analysis_text} onChange={(e) => setPost({ ...post, analysis_text: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="xG" value={post.xg} onChange={(e) => setPost({ ...post, xg: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Shots" value={post.shots} onChange={(e) => setPost({ ...post, shots: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Possession" value={post.possession} onChange={(e) => setPost({ ...post, possession: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Charts (comma-separated)" value={post.charts} onChange={(e) => setPost({ ...post, charts: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setPostImage(e.target.files?.[0] || null)} />
        <button disabled={submitting} className="bg-accent text-black font-semibold px-4 py-2 rounded md:col-span-2 disabled:opacity-50">{submitting ? 'Saving...' : 'Create Analysis Post'}</button>
      </form>

      <form onSubmit={createPrediction} className="card grid md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 font-heading text-xl font-bold">Create Prediction</h2>
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Match" value={prediction.match} onChange={(e) => setPrediction({ ...prediction, match: e.target.value })} required />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Teams (comma-separated)" value={prediction.teams} onChange={(e) => setPrediction({ ...prediction, teams: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Win probability (home,draw,away)" value={prediction.win_probability} onChange={(e) => setPrediction({ ...prediction, win_probability: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Expected goals (home,away)" value={prediction.expected_goals} onChange={(e) => setPrediction({ ...prediction, expected_goals: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Confidence %" value={prediction.confidence} onChange={(e) => setPrediction({ ...prediction, confidence: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Charts (comma-separated)" value={prediction.charts} onChange={(e) => setPrediction({ ...prediction, charts: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setPredictionImage(e.target.files?.[0] || null)} />
        <button disabled={submitting} className="bg-accent text-black font-semibold px-4 py-2 rounded md:col-span-2 disabled:opacity-50">{submitting ? 'Saving...' : 'Create Prediction'}</button>
      </form>
    </div>
  );
}
