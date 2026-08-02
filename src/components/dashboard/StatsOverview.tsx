'use client';

import { BookOpen, BookmarkCheck, BookMarked, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { BookStats } from '@/types';

interface StatsProps {
  stats: BookStats;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function StatsOverview({ stats }: StatsProps) {
  return (
    <div className="space-y-4">
      {/* Top Banner with Reading Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-zinc-900/40 to-emerald-500/10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 relative">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Reading Journey
            </span>
            <h2 className="text-2xl font-bold text-zinc-100">
              {stats.completed} of {stats.total} Books Completed
            </h2>
          </div>
          <div className="text-right">
            <motion.span 
              key={stats.completionPercentage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-extrabold text-amber-400 inline-block"
            >
              {stats.completionPercentage}%
            </motion.span>
            <p className="text-xs text-zinc-400">Total Completion</p>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-zinc-800/80 h-2.5 rounded-full mt-4 overflow-hidden p-0.5 border border-zinc-700/50">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${stats.completionPercentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full"
          />
        </div>
      </motion.div>

      {/* Grid Counters */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="glass-card p-4 rounded-xl flex items-center gap-3 transition-colors hover:border-amber-500/30"
        >
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Want to Read</p>
            <p className="text-xl font-bold text-zinc-100">{stats.wantToRead}</p>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="glass-card p-4 rounded-xl flex items-center gap-3 transition-colors hover:border-blue-500/30"
        >
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Currently Reading</p>
            <p className="text-xl font-bold text-zinc-100">{stats.reading}</p>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="glass-card p-4 rounded-xl flex items-center gap-3 transition-colors hover:border-emerald-500/30"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Completed</p>
            <p className="text-xl font-bold text-zinc-100">{stats.completed}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}