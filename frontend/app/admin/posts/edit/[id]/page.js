'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import { apiRequest } from '@/lib/api';

const initialForm = {
  title: '',
  match: '',
  teams: '',
  analysis_text: '',
  stats: '',
  xg: '',
  shots: '',
  possession: '',
  charts: '',
  imageUrl: ''
};

export default function EditPostPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <EditPostForm />
    </ProtectedRoute>
  );
}

function EditPostForm() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const payload = await apiRequest(`/posts/${id}`);
        const post = payload.data;
        setForm({
          title: post.title || '',
          match: post.match || '',
          teams: (post.teams || []).join(', '),
          analysis_text: post.analysis_text || '',
          stats: JSON.stringify(post.stats || {}, null, 2),
          xg: post.xg || '',
          shots: post.shots || '',
          possession: post.possession || '',
          charts: (post.charts || []).join(', '),
          imageUrl: post.imageUrl || ''
        });
      } catch (err) {
        setError(err.message || 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let parsedStats = {};
      if (form.stats.trim()) {
        parsedStats = JSON.parse(form.stats);
      }

      await apiRequest(`/posts/${id}`, {
        method: 'PUT',
        body: {
          ...form,
          teams: form.teams.split(',').map((v) => v.trim()).filter(Boolean),
          charts: form.charts.split(',').map((v) => v.trim()).filter(Boolean),
          stats: parsedStats
        }
      });

      setSuccess('Post updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageIntro title="Edit Post" subtitle="Update analysis post fields" />
      <ErrorBanner message={error} />
      {success && <p className="text-accent">{success}</p>}

      {loading ? (
        <p className="text-muted">Loading post...</p>
      ) : (
        <form onSubmit={submit} className="card grid md:grid-cols-2 gap-4">
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Match" value={form.match} onChange={(e) => setForm({ ...form, match: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Teams" value={form.teams} onChange={(e) => setForm({ ...form, teams: e.target.value })} />
          <textarea className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" rows="5" placeholder="Analysis text" value={form.analysis_text} onChange={(e) => setForm({ ...form, analysis_text: e.target.value })} />
          <textarea className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2 font-mono text-xs" rows="5" placeholder='Stats JSON e.g. {"xG":"1.2 - 0.9"}' value={form.stats} onChange={(e) => setForm({ ...form, stats: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="xG" value={form.xg} onChange={(e) => setForm({ ...form, xg: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Shots" value={form.shots} onChange={(e) => setForm({ ...form, shots: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Possession" value={form.possession} onChange={(e) => setForm({ ...form, possession: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Charts" value={form.charts} onChange={(e) => setForm({ ...form, charts: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />

          <div className="md:col-span-2 flex gap-3">
            <button disabled={saving} className="bg-accent text-black px-4 py-2 rounded font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="border border-white/20 px-4 py-2 rounded" onClick={() => router.push('/admin/posts')}>
              Back to Posts
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
