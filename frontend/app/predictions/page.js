'use client';

import { useEffect, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import PredictionCard from '@/components/PredictionCard';
import Pagination from '@/components/Pagination';
import ErrorBanner from '@/components/ErrorBanner';
import { apiBase } from '@/lib/api';

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [error, setError] = useState('');

  const fetchPredictions = async (page = 1) => {
    try {
      setError('');
      const res = await fetch(`${apiBase}/predictions?page=${page}&limit=6`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Could not load predictions.');
      const payload = await res.json();
      setPredictions(payload.data || []);
      setPagination(payload.pagination || { page: 1, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Unexpected error while loading predictions.');
    }
  };

  useEffect(() => {
    fetchPredictions(1);
  }, []);

  return (
    <div>
      <PageIntro title="Predictions" subtitle="Probabilistic forecasts for upcoming fixtures" />
      <ErrorBanner message={error} />
      <div className="grid md:grid-cols-2 gap-5">
        {predictions.map((prediction) => <PredictionCard key={prediction._id} prediction={prediction} />)}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchPredictions} />
    </div>
  );
}
