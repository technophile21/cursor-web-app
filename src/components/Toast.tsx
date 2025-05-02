'use client';

import { useEffect } from 'react';
import { strings } from '@/constants/strings';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

const typeStyles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export default function Toast({ message, onClose, duration = 5000, type = 'info' }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className={`${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium`}>
        {(strings as Record<string, string>)[message] || message}
      </div>
    </div>
  );
}

// Add the animation to tailwind.config.js
// animation: {
//   'fade-in': 'fadeIn 0.2s ease-in-out',
// },
// keyframes: {
//   fadeIn: {
//     '0%': { opacity: '0', transform: 'translateY(-10px) translateX(-50%)' },
//     '100%': { opacity: '1', transform: 'translateY(0) translateX(-50%)' },
//   },
// }, 