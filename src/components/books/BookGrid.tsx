'use client';

import { BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from './BookCard';
import { BookType, BookStatus } from '@/types';

interface BookGridProps {
  books: BookType[];
  loading: boolean;
  searchQuery: string;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: BookStatus) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export default function BookGrid({
  books,
  loading,
  searchQuery,
  onEdit,
  onDelete,
  onStatusChange,
}: BookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 glass-card rounded-xl animate-pulse bg-zinc-900/50" />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="text-center py-16 glass-card rounded-2xl border border-dashed border-zinc-800"
      >
        <BookMarked className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-zinc-300">No books found</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          {searchQuery
            ? 'No books match your current search criteria.'
            : 'Your shelf is empty. Click "Add Book" to start building your collection.'}
        </p>
      </motion.div>
    );
  }

  return (
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
            variants={cardVariants}
            layout
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <BookCard
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}