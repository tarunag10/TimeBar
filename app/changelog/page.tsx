import Link from 'next/link';

export default function ChangelogPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
        &larr; Back to calculator
      </Link>

      <h1 className="text-xl font-semibold text-slate-100 mt-6 mb-6">Changelog</h1>

      <div className="space-y-6">
        <div className="border-l-2 border-blue-500/30 pl-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-slate-200">v1.0.0</span>
            <span className="text-[10px] text-slate-500">April 2026</span>
          </div>
          <div className="text-[13px] text-slate-400 leading-relaxed space-y-2">
            <p className="text-slate-300 text-xs font-medium">Initial release</p>
            <ul className="space-y-1 text-[12px] text-slate-500">
              <li>&#8226; Simple contract limitation calculator (s.5)</li>
              <li>&#8226; Tort non-personal injury calculator (s.2)</li>
              <li>&#8226; Personal injury calculator with date of knowledge (s.11/s.14)</li>
              <li>&#8226; Defamation / malicious falsehood calculator (s.4A)</li>
              <li>&#8226; Disability postponement modifier (s.28)</li>
              <li>&#8226; Fraud / concealment / mistake postponement modifier (s.32)</li>
              <li>&#8226; Acknowledgment fresh accrual modifier (s.29)</li>
              <li>&#8226; Part payment fresh accrual modifier (s.29)</li>
              <li>&#8226; Manual review states for uncertain scenarios</li>
              <li>&#8226; Step-by-step reasoning trail with statute references</li>
              <li>&#8226; Visual timeline</li>
              <li>&#8226; Copy result to clipboard</li>
            </ul>
          </div>

          <div className="mt-4 bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-[10px] uppercase tracking-wider text-amber-500/70 mb-1">
              Legal review note
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All statute citations and section labels should be independently verified by a
              qualified legal professional before reliance. Rule files are marked with a
              last-reviewed date for audit purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
