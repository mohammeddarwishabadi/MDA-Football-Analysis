'use client';

import { useEffect, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import ErrorBanner from '@/components/ErrorBanner';
import { apiBase } from '@/lib/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [error, setError] = useState('');

  const fetchPosts = async (page = 1) => {
    try {
      setError('');
      const res = await fetch(`${apiBase}/posts?page=${page}&limit=6`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Could not load blog posts.');
      const payload = await res.json();
      setPosts(payload.data || []);
      setPagination(payload.pagination || { page: 1, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Unexpected error while loading posts.');
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  return (
    <div>
      <PageIntro title="Blog & Articles" subtitle="Long-form football analytics and methodology breakdowns" />
      <ErrorBanner message={error} />
      <div className="grid md:grid-cols-2 gap-5">
        {posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
      <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchPosts} />
    </div>
  );
}
