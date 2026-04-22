import React from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from './components/tp';
import { router } from './routes';

// Error boundary to catch render errors and display them instead of blank screen
interface EBState { hasError: boolean; error: Error | null; }
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, EBState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh', background: '#0A0F1C', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px 24px', fontFamily: 'system-ui, sans-serif', gap: 16
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: '#EF444422', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17v.01" />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>Something went wrong</div>
            <div style={{ fontSize: 13, color: '#94A3B8', maxWidth: 300, lineHeight: 1.6, fontFamily: 'monospace', background: '#111827', padding: '12px 16px', borderRadius: 12, textAlign: 'left', wordBreak: 'break-all' }}>
              {this.state.error?.message || 'Unknown error'}
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#3BA9FF', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Reload app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div style={{
          maxWidth: 430,
          minHeight: '100dvh',
          margin: '0 auto',
          position: 'relative',
          overflowX: 'hidden',
        }}>
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}