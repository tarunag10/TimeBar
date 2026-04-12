import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
        &larr; Back to calculator
      </Link>

      <h1 className="text-xl font-semibold text-slate-100 mt-6 mb-6">About TimeBar</h1>

      <div className="space-y-6 text-[13px] text-slate-400 leading-relaxed">
        <section>
          <h2 className="text-sm font-medium text-slate-200 mb-2">What is this tool?</h2>
          <p>
            TimeBar is an informational decision-support tool that calculates likely limitation
            expiry dates for common England &amp; Wales civil claim types. It is designed for
            lawyers, paralegals, and legal professionals who need a fast, reliable first-pass
            calculation.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-200 mb-2">How does it work?</h2>
          <p>
            The calculator uses a deterministic rules engine. You select a claim type, enter key
            dates, and toggle any applicable modifiers (disability, fraud/concealment, acknowledgment,
            part payment). The engine applies the relevant limitation rules and outputs a likely
            expiry date with a full reasoning trail.
          </p>
          <p className="mt-2">
            All calculations happen in your browser. No data is sent to any server. No dates or
            facts you enter are stored or tracked.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-200 mb-2">Methodology</h2>
          <p>
            Each supported claim type is defined by a versioned rule file containing the base
            limitation period, the accrual/start rule, supported modifiers, and manual review
            triggers. The engine:
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Determines the start date based on the claim type&apos;s start rule</li>
            <li>Calculates the base expiry by adding the limitation period</li>
            <li>Applies any modifier adjustments (postponement or fresh accrual)</li>
            <li>Checks for manual review triggers</li>
            <li>Returns the result with a step-by-step explanation</li>
          </ol>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-200 mb-2">Date counting</h2>
          <p>
            TimeBar uses exclusive date counting, which is the standard convention in English law.
            The date of accrual itself is excluded from the limitation period. For example, if a
            breach occurs on 14 June 2020 with a 6-year period, the expiry is 14 June 2026.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-200 mb-2">Important limitations</h2>
          <p>
            This tool is not legal advice. Limitation analysis depends on the specific facts of
            each case, including accrual, knowledge, disability, concealment, and whether a court
            may exercise discretion to disapply a time limit. The result is only as accurate as
            the inputs provided. Always verify independently.
          </p>
        </section>
      </div>
    </div>
  );
}
