'use client';

import { useEffect, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import MatchStatsCard from '@/components/MatchStatsCard';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import ErrorBanner from '@/components/ErrorBanner';
import SkeletonCard from '@/components/SkeletonCard';
import { apiRequest } from '@/lib/api';

export default function AnalysisPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      setError('');
      const query = search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
      const payload = await apiRequest(`/posts?page=${page}&limit=4${query}`);
      setPosts(payload.data || []);
      setPagination(payload.meta?.pagination || { currentPage: 1, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Unexpected error while loading analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [search]);

  return (
    <div className="space-y-5">
      <PageIntro title="Match Analysis" subtitle="xG, shots, possession and tactical insights" />
      <div className="card">
        <input className="w-full bg-black/30 border border-white/20 rounded p-3" placeholder="Search by team, match, or title" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <ErrorBanner message={error} />

      <div className="space-y-5">
        {loading ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />) : posts.map((post) => (
          <div key={post._id} className="grid lg:grid-cols-2 gap-4">
            <PostCard post={post} />
            <MatchStatsCard post={post} />
          </div>
        ))}
      </div>

      <Pagination page={pagination.currentPage || 1} totalPages={pagination.totalPages || 1} onPageChange={fetchPosts} />
    </div>
  );
}
