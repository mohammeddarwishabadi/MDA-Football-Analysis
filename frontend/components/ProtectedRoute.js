'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ roles = [], children }) {
  const router = useRouter();
  const { loading, token, user } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    if (roles.length > 0 && (!user || !roles.includes(user.role))) {
      router.replace('/');
    }
  }, [loading, token, user, roles, router]);

  if (loading) return <p className="text-muted">Checking session...</p>;
  if (!token) return null;
  if (roles.length > 0 && (!user || !roles.includes(user.role))) return null;

  return children;
}
