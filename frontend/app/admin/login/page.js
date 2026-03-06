'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form);
      if (user.role === 'admin' || user.role === 'editor') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <PageIntro title="Admin Login" subtitle="Secure access to publish analysis and predictions" />
      <form onSubmit={submit} className="card space-y-4">
        <input className="w-full bg-black/30 border border-white/20 rounded p-3" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full bg-black/30 border border-white/20 rounded p-3" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <ErrorBanner message={error} />
        <button disabled={loading} className="bg-accent text-black font-semibold px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
