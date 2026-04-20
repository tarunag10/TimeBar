'use client';

import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-4 text-center">
          <p className="text-[13px] text-slate-200 mb-2">
            Something went wrong{this.props.name ? ` with ${this.props.name}` : ''}.
          </p>
          <p className="text-[11px] text-slate-400 mb-3">
            Try refreshing the page, or click Retry to reload this section.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-4 py-1.5 rounded-lg text-[12px] font-medium
              bg-[var(--accent-soft)] border border-[var(--accent)]/30
              text-[var(--accent-text)] hover:bg-[var(--accent-soft)]/80
              transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
