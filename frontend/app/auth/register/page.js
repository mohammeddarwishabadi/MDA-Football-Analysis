'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageIntro from '@/components/PageIntro';
import ErrorBanner from '@/components/ErrorBanner';
import { useAuth } from '@/context/AuthContext';

const initialForm = {
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  password: ''
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = await register(form);
      setSuccess('Registration successful. Redirecting...');
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <PageIntro title="Create account" subtitle="Join MDA Football Analysis" />
      <form onSubmit={submit} className="card grid md:grid-cols-2 gap-3">
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="First name" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} required />
        <input className="bg-black/30 border border-white/20 rounded p-3" placeholder="Last name" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} required />
        <input className="bg-black/30 border border-white/20 rounded p-3 md:col-span-2" placeholder="Password (min 8 chars)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <ErrorBanner message={error} />
        {success && <p className="text-accent md:col-span-2">{success}</p>}
        <button disabled={loading} className="bg-accent text-black font-semibold px-4 py-2 rounded md:col-span-2 disabled:opacity-50">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
