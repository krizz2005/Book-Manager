'use client';

import { useState, useEffect } from 'react';
import { X, BookPlus, Sparkles, Loader2, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookType, BookStatus } from '@/types';

interface BookModalProps {
  isOpen: boolean;
  initialData?: BookType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: BookModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<BookStatus>('WANT_TO_READ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAuthor(initialData.author);
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setStatus(initialData.status);
    } else {
      setTitle('');
      setAuthor('');
      setTagsInput('');
      setStatus('WANT_TO_READ');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Parse comma-separated tags into a clean string array
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = { title, author, tags: parsedTags, status };

    try {
      const url = isEditing ? `/api/books/${initialData?._id}` : '/api/books';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save book');
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card w-full max-w-lg rounded-2xl p-6 relative border border-zinc-800 shadow-2xl z-10"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Modal Title */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                <BookPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100">
                  {isEditing ? 'Edit Book Details' : 'Add to Collection'}
                </h2>
                <p className="text-xs text-zinc-400">
                  {isEditing ? 'Update book metadata or status.' : 'Log a new book onto your personal shelf.'}
                </p>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Book Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Atomic Habits"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Author <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., James Clear"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Reading Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'WANT_TO_READ', label: '📖 Want to Read' },
                    { id: 'READING', label: '📘 Reading' },
                    { id: 'COMPLETED', label: '✅ Completed' },
                  ].map((st) => (
                    <motion.button
                      type="button"
                      key={st.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setStatus(st.id as BookStatus)}
                      className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                        status === st.id
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {st.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tags <span className="text-zinc-500 font-normal">(comma separated)</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Self-Help, Psychology, Productivity"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isEditing ? 'Save Changes' : 'Add Book'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}