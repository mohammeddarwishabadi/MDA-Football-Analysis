'use client';

import { useEffect, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import MatchStatsCard from '@/components/MatchStatsCard';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import ErrorBanner from '@/components/ErrorBanner';
import { apiBase } from '@/lib/api';

export default function AnalysisPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [error, setError] = useState('');

  const fetchPosts = async (page = 1) => {
    try {
      setError('');
      const res = await fetch(`${apiBase}/posts?page=${page}&limit=4`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Could not load analysis posts.');
      const payload = await res.json();
      setPosts(payload.data || []);
      setPagination(payload.pagination || { page: 1, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Unexpected error while loading analysis.');
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  return (
    <div>
      <PageIntro title="Match Analysis" subtitle="xG, shots, possession and tactical insights" />
      <ErrorBanner message={error} />
      <div className="space-y-5">
        {posts.map((post) => (
          <div key={post._id} className="grid lg:grid-cols-2 gap-4">
            <PostCard post={post} />
            <MatchStatsCard post={post} />
          </div>
        ))}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchPosts} />
    </div>
  );
}
