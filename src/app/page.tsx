'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Bookmark } from 'lucide-react';

interface BookType {
  _id: string;
  title: string;
  author: string;
  status: 'WANT_TO_READ' | 'READING' | 'COMPLETED';
  currentPage?: number;
  totalPages?: number;
}

export default function LandingPage() {
  const [currentBook, setCurrentBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch currently reading book from database
  useEffect(() => {
    async function fetchCurrentBook() {
      try {
        const res = await fetch('/api/books?status=READING');
        if (res.ok) {
          const data = await res.json();
          if (data.books && data.books.length > 0) {
            setCurrentBook(data.books[0]); // Pick the first currently reading book
          }
        }
      } catch (err) {
        console.error('Failed to fetch current reading book:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentBook();
  }, []);

  // Calculate completion percentage dynamically
  const currentPage = currentBook?.currentPage || 0;
  const totalPages = currentBook?.totalPages || 100;
  const progressPercentage = currentBook?.totalPages 
    ? Math.min(Math.round((currentPage / totalPages) * 100), 100) 
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <main className="max-w-3xl text-center space-y-8 z-10 flex flex-col items-center py-12">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-semibold shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Personal Book Manager
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight"
        >
          A Quiet, Powerful Space for <span className="text-amber-400">Your Reading</span>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed"
        >
          Log your books, track your reading progress, and rediscover your favorite authors with effortless clarity.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
            >
              Go to Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold rounded-xl transition-colors flex items-center justify-center"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>

        {/* Dynamic 3D Floating Motion Poster */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="pt-6 w-full max-w-sm"
        >
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotateX: [0, 4, 0],
              rotateY: [-3, 3, -3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.02, rotateX: 0, rotateY: 0 }}
            className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-md text-left flex flex-col gap-4 relative overflow-hidden group hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            {loading ? (
              <div className="h-28 animate-pulse bg-zinc-800/50 rounded-xl" />
            ) : currentBook ? (
              <>
                {/* Header Status */}
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                    <BookOpen className="w-3.5 h-3.5" /> Currently Reading
                  </span>
                  <span className="text-zinc-400 font-mono text-[11px]">
                    {progressPercentage}% Completed
                  </span>
                </div>

                {/* Real Book Details */}
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 font-bold shadow-md shrink-0">
                    <Bookmark className="w-6 h-6 text-zinc-950 fill-zinc-950" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h4 className="text-sm font-bold text-zinc-100 truncate">
                      {currentBook.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">{currentBook.author}</p>
                    {currentBook.totalPages && (
                      <p className="text-[11px] text-amber-400/90 font-mono">
                        {currentPage} / {totalPages} pages
                      </p>
                    )}
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="bg-amber-400 h-full rounded-full shadow-sm shadow-amber-400/50"
                  />
                </div>
              </>
            ) : (
              /* Fallback Card if no book is actively being read */
              <div className="py-2 text-center space-y-2">
                <div className="flex justify-center text-amber-400">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-200">Start Your Next Read</h4>
                <p className="text-xs text-zinc-400">
                  Add a book to your collection and set status to "Reading" to feature it here.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}