import Link from 'next/link';

export default function CoveragePage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
        &larr; Back to calculator
      </Link>

      <h1 className="text-xl font-semibold text-slate-100 mt-6 mb-6">Coverage &amp; Limitations</h1>

      <div className="space-y-6 text-[13px] text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-sm font-medium text-slate-200 mb-3">Supported claim types</h2>
          <div className="space-y-2">
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-slate-200 text-xs font-medium">Simple Contract</p>
              <p className="text-[11px] text-slate-500 mt-0.5">6 years from breach · Limitation Act 1980, s.5</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-slate-200 text-xs font-medium">Tort (Non-Personal Injury)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">6 years from accrual · Limitation Act 1980, s.2</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-slate-200 text-xs font-medium">Personal Injury</p>
              <p className="text-[11px] text-slate-500 mt-0.5">3 years from later of accrual or knowledge · Limitation Act 1980, s.11</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-slate-200 text-xs font-medium">Defamation / Malicious Falsehood</p>
              <p className="text-[11px] text-slate-500 mt-0.5">1 year from publication · Limitation Act 1980, s.4A</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-200 mb-3">Supported modifiers</h2>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#8226;</span>
              <span><span className="text-slate-300">Disability</span> — postponement under s.28</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#8226;</span>
              <span><span className="text-slate-300">Fraud / concealment / mistake</span> — postponement under s.32</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#8226;</span>
              <span><span className="text-slate-300">Acknowledgment</span> — fresh accrual under s.29</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#8226;</span>
              <span><span className="text-slate-300">Part payment</span> — fresh accrual under s.29</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium text-red-400/80 mb-3">Not covered in this version</h2>
          <p className="mb-2">
            The following claim types and scenarios are explicitly out of scope. If your matter
            involves any of these, manual legal review is required:
          </p>
          <ul className="space-y-1 text-slate-500 text-[12px]">
            <li>&#8226; Deeds and specialty claims (12-year period)</li>
            <li>&#8226; Land and property claims</li>
            <li>&#8226; Trust and standalone fraud claims</li>
            <li>&#8226; Latent damage negligence (s.14A knowledge-based regime)</li>
            <li>&#8226; Contribution claims</li>
            <li>&#8226; Fatal accidents and dependency claims</li>
            <li>&#8226; Product liability specific rules</li>
            <li>&#8226; Mortgage and secured debt timelines</li>
            <li>&#8226; Arbitration-specific time calculations</li>
            <li>&#8226; Insolvency effects on limitation</li>
            <li>&#8226; Limitation standstill agreements</li>
            <li>&#8226; Cross-border and conflict of laws issues</li>
            <li>&#8226; Court rules, procedural deadlines, or service deadlines</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-200 mb-2">Accuracy of results</h2>
          <p>
            The result is only as accurate as the inputs you provide. Accrual dates and dates of
            knowledge may be legally contestable. Where the facts are disputed or complex, the
            tool will flag the need for manual review rather than provide a potentially misleading
            answer.
          </p>
        </section>
      </div>
    </div>
  );
}
