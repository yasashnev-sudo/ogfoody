'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 React Error Boundary caught:', error, errorInfo);
    
    this.setState({ errorInfo });

    // Отправим ошибку через Debug систему
    if (typeof window !== 'undefined' && (window as any).__debugRecorder) {
      (window as any).__debugRecorder.captureError({
        errorMessage: `React Error: ${error.message}`,
        data: {
          componentStack: errorInfo.componentStack,
          stack: error.stack,
          name: error.name,
        },
        includeScreenshot: true,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">😔</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
              Упс! Что-то пошло не так
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              Ошибка автоматически отправлена разработчику. Мы скоро всё исправим!
            </p>

            {/* Error details (только в dev режиме) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm font-mono text-red-600 mb-2">
                  {this.state.error.message}
                </p>
                <details className="text-xs text-gray-600">
                  <summary className="cursor-pointer font-semibold mb-2">
                    Stack trace
                  </summary>
                  <pre className="overflow-x-auto whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                🔄 Перезагрузить страницу
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                ← Вернуться назад
              </button>
            </div>

            {/* Contact info */}
            <p className="text-xs text-gray-500 text-center mt-6">
              Проблема не решается?{' '}
              <a 
                href="mailto:support@example.com" 
                className="text-red-600 hover:underline"
              >
                Свяжитесь с поддержкой
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


