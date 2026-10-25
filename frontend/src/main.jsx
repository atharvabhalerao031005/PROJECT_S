import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Atelier Root Error Boundary Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#1C1310',
          color: '#B8772F',
          padding: '40px',
          fontFamily: 'monospace',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ color: '#F7F0E3', fontSize: '24px', borderBottom: '1px solid #B8772F', paddingBottom: '12px' }}>
            ATELIER // SYSTEM DIAGNOSTIC ERROR
          </h1>
          <p style={{ color: '#EBDCC2', fontSize: '18px', marginTop: '16px' }}>
            <b>{String(this.state.error?.message || this.state.error)}</b>
          </p>
          <pre style={{
            background: '#3A2619',
            padding: '16px',
            color: '#F7F0E3',
            marginTop: '16px',
            border: '1px solid #6B4630',
            whiteSpace: 'pre-wrap',
            fontSize: '12px',
            lineHeight: '1.5'
          }}>
            {this.state.error?.stack || 'No stack trace available'}
          </pre>
          {this.state.errorInfo && (
            <pre style={{
              background: '#251a13',
              padding: '16px',
              color: '#D2AE82',
              marginTop: '12px',
              border: '1px solid #6B4630',
              whiteSpace: 'pre-wrap',
              fontSize: '11px'
            }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
