'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import { apiBase } from '@/lib/api';

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
  const [ready, setReady] = useState(false);
  const [post, setPost] = useState(initialPost);
  const [prediction, setPrediction] = useState(initialPrediction);
  const [postImage, setPostImage] = useState(null);
  const [predictionImage, setPredictionImage] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const protect = async () => {
      const token = localStorage.getItem('mda_token');
      if (!token) {
        router.replace('/admin/login');
        return;
      }

      try {
        const res = await fetch(`${apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          router.replace('/admin/login');
          return;
        }

        const data = await res.json();
        setRole(data.user.role);

        // Requirement: only admin can access dashboard page.
        if (data.user.role !== 'admin') {
          router.replace('/');
          return;
        }

        localStorage.setItem('mda_user', JSON.stringify(data.user));
        setReady(true);
      } catch {
        router.replace('/admin/login');
      }
    };

    protect();
  }, [router]);

  const uploadImage = async (file) => {
    const token = localStorage.getItem('mda_token');
    const fd = new FormData();
    fd.append('image', file);

    const res = await fetch(`${apiBase}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    if (!res.ok) {
      const payload = await res.json();
      throw new Error(payload.message || 'Image upload failed');
    }

    const payload = await res.json();
    return payload.url;
  };

  const createPost = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    try {
      const token = localStorage.getItem('mda_token');
      const payload = {
        ...post,
        teams: post.teams.split(',').map((team) => team.trim()).filter(Boolean),
        charts: post.charts.split(',').map((chart) => chart.trim()).filter(Boolean),
        stats: {
          xG: post.xg,
          shots: post.shots,
          possession: post.possession
        }
      };

      if (postImage) {
        payload.imageUrl = await uploadImage(postImage);
      }

      const res = await fetch(`${apiBase}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to create post.');
      }

      setStatus('Post created successfully.');
      setPost(initialPost);
      setPostImage(null);
    } catch (err) {
      setError(err.message || 'Failed to create post.');
    }
  };

  const createPrediction = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    try {
      const token = localStorage.getItem('mda_token');
      const payload = {
        ...prediction,
        teams: prediction.teams.split(',').map((team) => team.trim()).filter(Boolean),
        win_probability: prediction.win_probability.split(',').map((n) => Number(n.trim())).filter((n) => !Number.isNaN(n)),
        expected_goals: prediction.expected_goals.split(',').map((n) => Number(n.trim())).filter((n) => !Number.isNaN(n)),
        confidence: Number(prediction.confidence),
        charts: prediction.charts.split(',').map((chart) => chart.trim()).filter(Boolean)
      };

      if (predictionImage) {
        payload.imageUrl = await uploadImage(predictionImage);
      }

      const res = await fetch(`${apiBase}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to create prediction.');
      }

      setStatus('Prediction created successfully.');
      setPrediction(initialPrediction);
      setPredictionImage(null);
    } catch (err) {
      setError(err.message || 'Failed to create prediction.');
    }
  };

  if (!ready) return <p className="text-muted">Checking admin access...</p>;

  return (
    <div className="space-y-8">
      <PageIntro title="Admin Dashboard" subtitle={`Role: ${role} · Create, edit, delete posts and publish predictions`} />
      <ErrorBanner message={error} />
      {status && <p className="text-accent">{status}</p>}

      <form onSubmit={createPost} className="card grid md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 font-heading text-xl font-bold">Create Analysis Post</h2>
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Match" value={post.match} onChange={(e) => setPost({ ...post, match: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Teams (comma-separated)" value={post.teams} onChange={(e) => setPost({ ...post, teams: e.target.value })} />
        <textarea className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" rows="4" placeholder="Analysis text" value={post.analysis_text} onChange={(e) => setPost({ ...post, analysis_text: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="xG" value={post.xg} onChange={(e) => setPost({ ...post, xg: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Shots" value={post.shots} onChange={(e) => setPost({ ...post, shots: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Possession" value={post.possession} onChange={(e) => setPost({ ...post, possession: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Charts (comma-separated)" value={post.charts} onChange={(e) => setPost({ ...post, charts: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setPostImage(e.target.files?.[0] || null)} />
        <button className="bg-accent text-black font-semibold px-4 py-2 rounded md:col-span-2">Create Analysis Post</button>
      </form>

      <form onSubmit={createPrediction} className="card grid md:grid-cols-2 gap-4">
        <h2 className="md:col-span-2 font-heading text-xl font-bold">Create Prediction</h2>
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Match" value={prediction.match} onChange={(e) => setPrediction({ ...prediction, match: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Teams (comma-separated)" value={prediction.teams} onChange={(e) => setPrediction({ ...prediction, teams: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Win probability (home,draw,away)" value={prediction.win_probability} onChange={(e) => setPrediction({ ...prediction, win_probability: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Expected goals (home,away)" value={prediction.expected_goals} onChange={(e) => setPrediction({ ...prediction, expected_goals: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Confidence %" value={prediction.confidence} onChange={(e) => setPrediction({ ...prediction, confidence: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Charts (comma-separated)" value={prediction.charts} onChange={(e) => setPrediction({ ...prediction, charts: e.target.value })} />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setPredictionImage(e.target.files?.[0] || null)} />
        <button className="bg-accent text-black font-semibold px-4 py-2 rounded md:col-span-2">Create Prediction</button>
      </form>
    </div>
  );
}
