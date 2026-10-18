import React, { Component, ErrorInfo, ReactNode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    __INITIAL_DATA__?: any;
  }
}

class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error('App runtime error caught by RootErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Display Issue</h2>
            <p className="text-sm text-slate-600 mb-6">{this.state.error?.message || 'An unexpected rendering error occurred.'}</p>
            <button
              onClick={() => { window.location.reload(); }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const initialData = window.__INITIAL_DATA__;
  const initialPath = window.location.pathname || '/';

  const appNode = (
    <RootErrorBoundary>
      <App initialPath={initialPath} initialData={initialData} />
    </RootErrorBoundary>
  );

  // If the root already has SSR child nodes, hydrate; otherwise render cleanly
  if (rootEl.hasChildNodes()) {
    try {
      hydrateRoot(rootEl, appNode);
    } catch (err) {
      console.warn('Hydration mismatch encountered, recovering with createRoot:', err);
      const root = createRoot(rootEl);
      root.render(appNode);
    }
  } else {
    const root = createRoot(rootEl);
    root.render(appNode);
  }
}

