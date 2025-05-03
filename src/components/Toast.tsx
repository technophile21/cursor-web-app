'use client';

import { useEffect } from 'react';

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

export default function Toast({ message, onClose, duration = 3000, type = 'info' }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white/70 hover:text-white"
        >
          ✕
        </button>
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