import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const base = 'px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50';
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/10',
    secondary: 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300',
    danger: 'bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}