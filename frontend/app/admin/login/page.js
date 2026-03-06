'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import { apiBase } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.message || 'Invalid credentials');
      }

      const data = await res.json();
      localStorage.setItem('mda_token', data.token);
      localStorage.setItem('mda_user', JSON.stringify(data.user));

      if (data.user.role === 'admin' || data.user.role === 'editor') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <PageIntro title="Admin Login" subtitle="Secure access to publish analysis and predictions" />
      <form onSubmit={submit} className="card space-y-4">
        <input className="w-full bg-black/30 border border-white/20 rounded p-3" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full bg-black/30 border border-white/20 rounded p-3" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <ErrorBanner message={error} />
        <button className="bg-accent text-black font-semibold px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
