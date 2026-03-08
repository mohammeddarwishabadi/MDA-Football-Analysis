'use client';

import { useEffect, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import ErrorBanner from '@/components/ErrorBanner';
import { apiRequest } from '@/lib/api';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      setError('');

      if (query.trim()) {
        const payload = await apiRequest(`/posts/search?q=${encodeURIComponent(query.trim())}`);
        setPosts(payload.data || []);
        setPagination({ currentPage: 1, totalPages: 1 });
      } else {
        const payload = await apiRequest(`/posts?page=${page}&limit=6`);
        setPosts(payload.data || []);
        setPagination(payload.pagination || { currentPage: 1, totalPages: 1 });
      }
    } catch (err) {
      setError(err.message || 'Unexpected error while loading posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [query]);

  return (
    <div className="space-y-5">
      <PageIntro title="Blog & Articles" subtitle="Long-form football analytics and methodology breakdowns" />
      <div className="card">
        <input
          className="w-full bg-black/30 border border-white/20 rounded p-3"
          placeholder="Search analysis by title or content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ErrorBanner message={error} />
      {loading ? <p className="text-muted">Loading posts...</p> : (
        <div className="grid md:grid-cols-2 gap-5">
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      )}
      {!query.trim() && (
        <Pagination
          page={pagination.currentPage || pagination.page || 1}
          totalPages={pagination.totalPages || 1}
          onPageChange={fetchPosts}
        />
      )}
    </div>
  );
}
