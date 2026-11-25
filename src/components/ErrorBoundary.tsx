import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Ha ocurrido un error inesperado.',
    };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA] dark:bg-[#121726] px-6 py-12">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-[#1A2035] border border-[#E2E8F2] dark:border-[#2B3654] p-8 text-center">
            <h2 className="text-xl font-bold text-[#1A2035] dark:text-[#F4F6FA]">
              Algo no salió como esperábamos
            </h2>
            <p className="mt-3 text-sm text-[#525E7A] dark:text-[#9BA8C4] leading-relaxed">
              Intenta recargar la página para continuar tu recorrido con tranquilidad.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2270E2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1B5EC0] transition-colors cursor-pointer"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
