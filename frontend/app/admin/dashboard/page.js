'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonCard from '@/components/SkeletonCard';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

const INIT_POST = { title: '', match: '', teams: '', analysis_text: '', xg: '', shots: '', possession: '' };

function DashboardContent() {
  const { user } = useAuth();
  const fileRef = useRef(null);

  const [stats, setStats] = useState({ totalPosts: 0, totalPredictions: 0, totalUsers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [form, setForm] = useState(INIT_POST);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const payload = await apiRequest('/admin/stats');
      setStats(payload.data || {});
    } catch {
      /* stats are supplementary — fail silently */
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const payload = await apiRequest('/posts?page=1&limit=50');
      setPosts(payload.data || []);
    } catch {
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchPosts();
  }, [fetchStats, fetchPosts]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl('');
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('image', file);
      const payload = await apiRequest('/upload', { method: 'POST', body: fd, isFormData: true });
      setImageUrl(payload.data?.url || '');
      showToast('Image uploaded to Cloudinary', 'success');
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error');
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.title.trim() || !form.analysis_text.trim()) {
      setFormError('Title and Content are required.');
      return;
    }
    if (imageFile && !imageUrl) {
      setFormError('Please wait — image is still uploading.');
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        title: form.title.trim(),
        match: form.match.trim(),
        teams: form.teams.split(',').map(t => t.trim()).filter(Boolean),
        analysis_text: form.analysis_text.trim(),
        stats: { xG: form.xg, shots: form.shots, possession: form.possession },
        ...(imageUrl && { imageUrl })
      };

      await apiRequest('/posts', { method: 'POST', body });
      showToast('Post published successfully', 'success');
      setForm(INIT_POST);
      clearImage();
      fetchPosts();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to create post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await apiRequest(`/posts/${id}`, { method: 'DELETE' });
      showToast('Post deleted', 'success');
      setPosts(prev => prev.filter(p => p._id !== id));
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))
  });

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <PageIntro
        title="CMS Dashboard"
        subtitle={`Signed in as ${user?.firstname || user?.email || 'Admin'}`}
      />

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg border transition-all
          ${toast.type === 'error'
            ? 'bg-red-950 border-red-500/40 text-red-200'
            : 'bg-[#0B0F14] border-accent/40 text-accent'}`}>
          {toast.message}
        </div>
      )}

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statsLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : (
            <>
              <KpiCard label="Total Posts" value={stats.totalPosts ?? 0} />
              <KpiCard label="Total Predictions" value={stats.totalPredictions ?? 0} />
              <KpiCard label="Registered Users" value={stats.totalUsers ?? 0} />
            </>
          )}
      </section>

      <section>
        <h2 className="section-title mb-6">New Post</h2>
        <form onSubmit={handleSubmit} className="card space-y-6">
          <ErrorBanner message={formError} />

          <div className="space-y-1">
            <Label>Title <Required /></Label>
            <input
              className="input w-full"
              placeholder="e.g. Arsenal 2-1 Liverpool: Pressing Traps Won the Midfield"
              {...field('title')}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Match</Label>
              <input className="input w-full" placeholder="e.g. Premier League – Matchday 24" {...field('match')} />
            </div>
            <div className="space-y-1">
              <Label>Teams <span className="text-muted text-xs">(comma-separated)</span></Label>
              <input className="input w-full" placeholder="Arsenal, Liverpool" {...field('teams')} />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Content <Required /></Label>
            <textarea
              className="input w-full resize-y"
              rows={8}
              placeholder="Write your tactical analysis here…"
              {...field('analysis_text')}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>xG</Label>
              <input className="input w-full" placeholder="1.93 – 1.21" {...field('xg')} />
            </div>
            <div className="space-y-1">
              <Label>Shots</Label>
              <input className="input w-full" placeholder="14 – 9" {...field('shots')} />
            </div>
            <div className="space-y-1">
              <Label>Possession</Label>
              <input className="input w-full" placeholder="56% – 44%" {...field('possession')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer
                ${imagePreview ? 'border-accent/40' : 'border-white/10 hover:border-accent/30'}
                ${uploading ? 'opacity-60 cursor-wait' : ''}`}
            >
              {imagePreview ? (
                <div className="relative h-48 w-full rounded-xl overflow-hidden">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Click to replace</span>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-muted text-sm">Click to upload a cover image</p>
                  <p className="text-muted/60 text-xs mt-1">JPG, PNG, WebP · max 3 MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {uploading && (
              <p className="text-xs text-accent animate-pulse">Uploading to Cloudinary…</p>
            )}
            {imageUrl && !uploading && (
              <div className="flex items-center gap-3">
                <p className="text-xs text-accent truncate flex-1">✓ {imageUrl}</p>
                <button type="button" onClick={clearImage} className="text-xs text-muted hover:text-red-400 transition-colors">Remove</button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-white/10">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="bg-accent text-black font-semibold px-6 py-2.5 rounded disabled:opacity-50 transition-opacity"
            >
              {submitting ? 'Publishing…' : 'Publish Post'}
            </button>
            <button type="button" onClick={() => { setForm(INIT_POST); clearImage(); setFormError(''); }} className="text-muted text-sm hover:text-white transition-colors">
              Clear form
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="section-title mb-4">All Posts</h2>
        {postsLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : posts.length === 0 ? (
          <div className="card text-center text-muted py-10">No posts yet. Create your first one above.</div>
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-muted text-left">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Match</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p, i) => (
                  <tr
                    key={p._id}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i === posts.length - 1 ? 'border-0' : ''}`}
                  >
                    <td className="px-5 py-3 font-medium max-w-xs truncate">{p.title}</td>
                    <td className="px-5 py-3 text-muted hidden md:table-cell">{p.match || '—'}</td>
                    <td className="px-5 py-3 text-muted hidden lg:table-cell">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-xs font-medium text-red-400/80 hover:text-red-400 border border-red-400/20 hover:border-red-400/50 px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-muted text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-4xl font-heading font-bold">{value}</p>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-sm font-medium text-white/80">{children}</label>;
}

function Required() {
  return <span className="text-accent ml-0.5">*</span>;
}
