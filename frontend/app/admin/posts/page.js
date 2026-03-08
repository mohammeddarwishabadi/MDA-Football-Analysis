'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBanner from '@/components/ErrorBanner';
import PageIntro from '@/components/PageIntro';
import { apiRequest } from '@/lib/api';

export default function AdminPostsPage() {
  return (
    <ProtectedRoute roles={['admin']}>
      <PostsManager />
    </ProtectedRoute>
  );
}

function PostsManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await apiRequest('/posts?page=1&limit=20');
      setPosts(payload.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      await apiRequest(`/posts/${postId}`, { method: 'DELETE' });
      setSuccess('Post deleted successfully.');
      fetchPosts();
    } catch (err) {
      setError(err.message || 'Failed to delete post.');
    }
  };

  return (
    <div className="space-y-6">
      <PageIntro title="Admin · Posts" subtitle="Edit and delete analysis posts" />
      <ErrorBanner message={error} />
      {success && <p className="text-accent">{success}</p>}

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-muted">Loading posts...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-muted">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Match</th>
                <th className="py-3 pr-4">Edit</th>
                <th className="py-3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b border-white/5">
                  <td className="py-3 pr-4">{post.title}</td>
                  <td className="py-3 pr-4">{post.match || '-'}</td>
                  <td className="py-3 pr-4">
                    <Link className="text-accent hover:underline" href={`/admin/posts/edit/${post._id}`}>
                      Edit
                    </Link>
                  </td>
                  <td className="py-3">
                    <button className="text-red-300 hover:text-red-200" onClick={() => deletePost(post._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
