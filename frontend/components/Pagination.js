'use client';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        className="px-4 py-2 rounded border border-white/20 disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        className="px-4 py-2 rounded border border-white/20 disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
