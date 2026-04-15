import AnalyticsDashboard from './AnalyticsDashboard';

export const metadata = {
  title: 'Analytics — TimeBar',
  robots: 'noindex',
};

export default function AnalyticsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl display-serif text-gradient mb-2">Analytics</h1>
      <p className="text-sm text-slate-400 mb-8">
        Anonymous usage data stored locally in this browser. No PII or user-entered dates are tracked.
      </p>
      <AnalyticsDashboard />
    </div>
  );
}
