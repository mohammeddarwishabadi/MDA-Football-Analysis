'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import { apiRequest } from '@/lib/api';

const initialForm = {
  match: '',
  teams: '',
  win_probability: '',
  expected_goals: '',
  confidence: '',
  charts: '',
  imageUrl: ''
};

export default function EditPredictionPage() {
  return (
    <ProtectedRoute roles={['admin', 'editor']}>
      <EditPredictionForm />
    </ProtectedRoute>
  );
}

function EditPredictionForm() {
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
        const prediction = await apiRequest(`/predictions/${id}`);
        setForm({
          match: prediction.match || '',
          teams: (prediction.teams || []).join(', '),
          win_probability: (prediction.win_probability || []).join(', '),
          expected_goals: (prediction.expected_goals || []).join(', '),
          confidence: prediction.confidence?.toString() || '',
          charts: (prediction.charts || []).join(', '),
          imageUrl: prediction.imageUrl || ''
        });
      } catch (err) {
        setError(err.message || 'Failed to load prediction.');
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
      await apiRequest(`/predictions/${id}`, {
        method: 'PUT',
        body: {
          ...form,
          teams: form.teams.split(',').map((v) => v.trim()).filter(Boolean),
          win_probability: form.win_probability.split(',').map((v) => Number(v.trim())).filter((v) => !Number.isNaN(v)),
          expected_goals: form.expected_goals.split(',').map((v) => Number(v.trim())).filter((v) => !Number.isNaN(v)),
          confidence: Number(form.confidence),
          charts: form.charts.split(',').map((v) => v.trim()).filter(Boolean)
        }
      });

      setSuccess('Prediction updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update prediction.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageIntro title="Edit Prediction" subtitle="Update prediction fields" />
      <ErrorBanner message={error} />
      {success && <p className="text-accent">{success}</p>}

      {loading ? (
        <p className="text-muted">Loading prediction...</p>
      ) : (
        <form onSubmit={submit} className="card grid md:grid-cols-2 gap-4">
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Match" value={form.match} onChange={(e) => setForm({ ...form, match: e.target.value })} required />
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Teams" value={form.teams} onChange={(e) => setForm({ ...form, teams: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Win probability" value={form.win_probability} onChange={(e) => setForm({ ...form, win_probability: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Expected goals" value={form.expected_goals} onChange={(e) => setForm({ ...form, expected_goals: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Confidence" value={form.confidence} onChange={(e) => setForm({ ...form, confidence: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Charts" value={form.charts} onChange={(e) => setForm({ ...form, charts: e.target.value })} />
          <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />

          <div className="md:col-span-2 flex gap-3">
            <button disabled={saving} className="bg-accent text-black px-4 py-2 rounded font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="border border-white/20 px-4 py-2 rounded" onClick={() => router.push('/admin/predictions')}>
              Back to Predictions
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
