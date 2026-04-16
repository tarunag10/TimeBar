import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 mb-6">
        <FileQuestion className="w-7 h-7 text-blue-400" />
      </div>
      <h1 className="text-xl font-semibold text-slate-200 mb-2">
        Page not found
      </h1>
      <p className="text-sm text-slate-400 font-light leading-relaxed mb-8 max-w-sm mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Head back to the calculator to continue.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
          bg-white/[0.06] border border-white/[0.08] text-slate-200
          hover:bg-white/[0.1] hover:border-[#d5b06b]/30 transition-all duration-200"
      >
        Back to calculator
      </Link>
    </div>
  );
}
