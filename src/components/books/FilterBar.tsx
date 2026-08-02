'use client';

import { Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onAddBook: () => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onAddBook,
}: FilterBarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
    >
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 text-zinc-200 placeholder:text-zinc-500 transition-colors"
        />
      </div>

      {/* Status Filter Tabs & Add Button */}
      <div className="flex items-center gap-3">
        <div className="flex bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl text-xs">
          {[
            { id: 'ALL', label: 'All Books' },
            { id: 'WANT_TO_READ', label: 'Want to Read' },
            { id: 'READING', label: 'Reading' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((st) => (
            <motion.button
              key={st.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStatusChange(st.id)}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer relative ${
                selectedStatus === st.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {st.label}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddBook}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Book
        </motion.button>
      </div>
    </motion.div>
  );
}