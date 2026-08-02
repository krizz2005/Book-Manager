'use client';

import { Edit2, Trash2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { BookType, BookStatus } from '@/types';

interface BookCardProps {
  book: BookType;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: BookStatus) => void;
}

const STATUS_CONFIG: Record<BookStatus, { label: string; icon: string; style: string }> = {
  WANT_TO_READ: {
    label: 'Want to Read',
    icon: '📖',
    style: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  READING: {
    label: 'Reading',
    icon: '📘',
    style: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  },
  COMPLETED: {
    label: 'Completed',
    icon: '✅',
    style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
};

export default function BookCard({ book, onEdit, onDelete, onStatusChange }: BookCardProps) {
  const currentStatus = STATUS_CONFIG[book.status];

  return (
    <motion.div
      layout
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card glass-card-hover p-5 rounded-xl flex flex-col justify-between group h-full relative"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <motion.select
            whileTap={{ scale: 0.96 }}
            value={book.status}
            onChange={(e) => onStatusChange(book._id, e.target.value as BookStatus)}
            className={`text-xs px-2.5 py-1 rounded-md border font-medium cursor-pointer focus:outline-none transition-colors ${currentStatus.style}`}
          >
            <option value="WANT_TO_READ" className="bg-zinc-900 text-zinc-200">📖 Want to Read</option>
            <option value="READING" className="bg-zinc-900 text-zinc-200">📘 Reading</option>
            <option value="COMPLETED" className="bg-zinc-900 text-zinc-200">✅ Completed</option>
          </motion.select>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(book)}
              className="p-1.5 text-zinc-400 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-colors"
              title="Edit book"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(book._id)}
              className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
              title="Delete book"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Title & Author */}
        <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm text-zinc-400 mb-4 line-clamp-1">by {book.author}</p>
      </div>

      {/* Tags */}
      {book.tags && book.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/80">
          {book.tags.map((tag) => (
            <motion.span
              whileHover={{ scale: 1.05 }}
              key={tag}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
            >
              <Tag className="w-3 h-3 text-zinc-500" />
              {tag}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}