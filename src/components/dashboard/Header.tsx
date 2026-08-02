'use client';

import { Library, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserType } from '@/types';

interface HeaderProps {
  user?: UserType | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between pb-6 border-b border-zinc-800"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400"
        >
          <Library className="w-6 h-6" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">BookShelf</h1>
          <p className="text-xs text-zinc-400">Personal Reading Manager</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl"
          >
            <div className="p-1 bg-amber-500/20 text-amber-300 rounded-lg">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-zinc-300">{user.name}</span>
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogout}
          className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </motion.button>
      </div>
    </motion.header>
  );
}