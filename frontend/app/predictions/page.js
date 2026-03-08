'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageIntro from '@/components/PageIntro';
import PredictionCard from '@/components/PredictionCard';
import Pagination from '@/components/Pagination';
import ErrorBanner from '@/components/ErrorBanner';
import SkeletonCard from '@/components/SkeletonCard';
import { apiRequest } from '@/lib/api';

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPredictions = async (page = 1) => {
    setLoading(true);
    try {
      setError('');
      const payload = await apiRequest(`/predictions?page=${page}&limit=6`);
      setPredictions(payload.data || []);
      setPagination(payload.meta?.pagination || { currentPage: 1, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Unexpected error while loading predictions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions(1);
  }, []);

  return (
    <div className="space-y-5">
      <PageIntro title="Predictions" subtitle="Probabilistic forecasts for upcoming fixtures" />
      <div><Link href="/predictions/advanced" className="text-accent hover:underline">Go to premium advanced predictions →</Link></div>
      <ErrorBanner message={error} />
      <div className="grid md:grid-cols-2 gap-5">
        {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : predictions.map((prediction) => <PredictionCard key={prediction._id} prediction={prediction} />)}
      </div>
      <Pagination page={pagination.currentPage || 1} totalPages={pagination.totalPages || 1} onPageChange={fetchPredictions} />
    </div>
  );
}
