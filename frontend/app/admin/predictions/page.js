'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBanner from '@/components/ErrorBanner';
import PageIntro from '@/components/PageIntro';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminPredictionsPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <PredictionsManager />
    </ProtectedRoute>
  );
}

function PredictionsManager() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPredictions = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await apiRequest('/predictions?page=1&limit=20');
      setPredictions(payload.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load predictions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const deletePrediction = async (predictionId) => {
    if (user?.role !== 'admin') {
      setError('Only admin users can delete predictions.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this prediction?');
    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await apiRequest(`/predictions/${predictionId}`, { method: 'DELETE' });
      setSuccess('Prediction deleted successfully.');
      fetchPredictions();
    } catch (err) {
      setError(err.message || 'Failed to delete prediction.');
    }
  };

  return (
    <div className="space-y-6">
      <PageIntro title="Admin · Predictions" subtitle="Edit and delete prediction records" />
      <ErrorBanner message={error} />
      {success && <p className="text-accent">{success}</p>}

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-muted">Loading predictions...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-muted">
                <th className="py-3 pr-4">Match</th>
                <th className="py-3 pr-4">Win Probability</th>
                <th className="py-3 pr-4">Confidence</th>
                <th className="py-3 pr-4">Edit</th>
                <th className="py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => (
                <tr key={prediction._id} className="border-b border-white/5">
                  <td className="py-3 pr-4">{prediction.match}</td>
                  <td className="py-3 pr-4">{(prediction.win_probability || []).join(' / ')}</td>
                  <td className="py-3 pr-4">{prediction.confidence ?? '-'}%</td>
                  <td className="py-3 pr-4">
                    <Link className="text-accent hover:underline" href={`/admin/predictions/edit/${prediction._id}`}>
                      Edit
                    </Link>
                  </td>
                  <td className="py-3">
                    <button className="text-red-300 hover:text-red-200 disabled:opacity-50" onClick={() => deletePrediction(prediction._id)} disabled={user?.role !== 'admin'}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
