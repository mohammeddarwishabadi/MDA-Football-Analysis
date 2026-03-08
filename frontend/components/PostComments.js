'use client';

import { useEffect, useState } from 'react';
import ErrorBanner from '@/components/ErrorBanner';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PostComments({ postId }) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = await apiRequest(`/posts/${postId}/comments`);
      setComments(payload.data || []);
    } catch (err) {
      setError(err.message || 'Could not load comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to comment.');
      return;
    }

    if (!content.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      await apiRequest(`/posts/${postId}/comments`, {
        method: 'POST',
        body: { content }
      });
      setContent('');
      fetchComments();
    } catch (err) {
      setError(err.message || 'Failed to submit comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card space-y-4">
      <h2 className="font-heading text-2xl font-bold">Comments</h2>
      <ErrorBanner message={error} />

      <form onSubmit={submitComment} className="space-y-3">
        <textarea
          className="w-full bg-black/30 border border-white/20 rounded p-3"
          rows="3"
          placeholder={user ? 'Share your analysis…' : 'Login to add a comment'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!token || submitting}
        />
        <button disabled={!token || submitting} className="bg-accent text-black font-semibold px-4 py-2 rounded disabled:opacity-50">
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {loading ? (
        <p className="text-muted">Loading comments...</p>
      ) : (
        <div className="space-y-3">
          {comments.length === 0 && <p className="text-muted">No comments yet.</p>}
          {comments.map((comment) => (
            <article key={comment._id} className="bg-black/20 rounded-lg p-3 border border-white/10">
              <p className="text-sm text-muted">{comment.user?.email || 'Unknown user'} · {new Date(comment.createdAt).toLocaleString()}</p>
              <p className="mt-1">{comment.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
