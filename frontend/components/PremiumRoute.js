'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PremiumRoute({ children }) {
  const router = useRouter();
  const { loading, token, user } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    if (user?.subscription !== 'premium') {
      router.replace('/predictions');
    }
  }, [loading, token, user, router]);

  if (loading) return <p className="text-muted">Checking premium access...</p>;
  if (!token || user?.subscription !== 'premium') return null;

  return children;
}
