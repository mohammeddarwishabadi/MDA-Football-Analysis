'use client';

import { useEffect, useState } from 'react';
import PremiumRoute from '@/components/PremiumRoute';
import ErrorBanner from '@/components/ErrorBanner';
import PageIntro from '@/components/PageIntro';
import { apiRequest } from '@/lib/api';

export default function AdvancedPredictionsPage() {
  return (
    <PremiumRoute>
      <AdvancedContent />
    </PremiumRoute>
  );
}

function AdvancedContent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const payload = await apiRequest('/predictions/advanced/premium-feed');
        setData(payload);
      } catch (err) {
        setError(err.message || 'Unable to load premium predictions');
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-5">
      <PageIntro title="Advanced Predictions" subtitle="Premium-only model intelligence" />
      <ErrorBanner message={error} />
      <div className="card">
        <p className="text-muted">{data?.message || 'Loading premium feed...'}</p>
        <ul className="mt-3 list-disc pl-5">
          {(data?.indicators || []).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
}
