import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'blue' | 'emerald' | 'zinc';
}

export function Badge({ children, variant = 'zinc' }: BadgeProps) {
  const styles = {
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    zinc: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/50',
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}