'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, BookMarked, LogOut, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsOverview from '@/components/dashboard/StatsOverview';
import BookCard from '@/components/books/BookCard';
import BookModal from '@/components/books/BookModal';
import { BookType, BookStats, BookStatus } from '@/types';

// Animation Variants for Staggered Grid & Elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export default function DashboardPage() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [stats, setStats] = useState<BookStats>({
    total: 0,
    wantToRead: 0,
    reading: 0,
    completed: 0,
    completionPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);

  // Fetch books from API
  const fetchBooks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (search) params.append('search', search);

      const res = await fetch(`/api/books?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load');

      const data = await res.json();
      setBooks(data.books);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, search]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Quick update status
  const handleStatusChange = async (id: string, newStatus: BookStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );

    await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchBooks();
  };

  // Delete book
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this book?')) return;

    setBooks((prev) => prev.filter((b) => b._id !== id));

    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  // Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative"
    >
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-zinc-800">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">BookShelf</h1>
            <p className="text-xs text-zinc-400">Personal Reading Manager</p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </motion.button>
      </header>

      {/* Insights Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StatsOverview stats={stats} />
      </motion.div>

      {/* Control Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
      >
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 text-zinc-200 placeholder:text-zinc-500 transition-all focus:ring-2 focus:ring-amber-500/10"
          />
        </div>

        {/* Status Tabs & Add Button */}
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl text-xs relative">
            {['ALL', 'WANT_TO_READ', 'READING', 'COMPLETED'].map((st) => {
              const isSelected = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`relative px-3 py-1.5 rounded-lg font-medium transition-colors z-10 ${
                    isSelected ? 'text-amber-300' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 bg-amber-500/20 border border-amber-500/30 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {st === 'ALL' ? 'All Books' : st.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setEditingBook(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/10 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Book
          </motion.button>
        </div>
      </motion.div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 glass-card rounded-xl animate-pulse bg-zinc-900/50 border border-zinc-800/50" />
          ))}
        </div>
      ) : books.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {books.map((book) => (
              <motion.div 
                key={book._id} 
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <BookCard
                  book={book}
                  onEdit={(b) => {
                    setEditingBook(b);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16 glass-card rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20"
        >
          <BookMarked className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">No books found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {search
              ? 'No books match your current search criteria.'
              : 'Your shelf is empty. Click "Add Book" to start building your collection.'}
          </p>
        </motion.div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <BookModal
            isOpen={isModalOpen}
            initialData={editingBook}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              fetchBooks();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}