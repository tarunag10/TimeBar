'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TimeBar error:', error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 mb-6">
        <AlertTriangle className="w-7 h-7 text-rose-400" />
      </div>
      <h1 className="text-xl font-semibold text-slate-200 mb-2">
        Something went wrong
      </h1>
      <p className="text-sm text-slate-400 font-light leading-relaxed mb-8 max-w-sm mx-auto">
        An unexpected error occurred. This is not a legal calculation issue —
        it&apos;s a technical problem with the app. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
          bg-white/[0.06] border border-white/[0.08] text-slate-200
          hover:bg-white/[0.1] hover:border-[#d5b06b]/30 transition-all duration-200 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
