import React from 'react';
import ErrorPage from '../../pages/ErrorPage';
import { logError } from '../../utils/logger';

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  private handleWindowError = (event: ErrorEvent) => {
    this.setState({ hasError: true });
    logError('AppErrorBoundary.windowError', event.error ?? event.message);
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.setState({ hasError: true });
    logError('AppErrorBoundary.unhandledRejection', event.reason);
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidMount(): void {
    window.addEventListener('error', this.handleWindowError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount(): void {
    window.removeEventListener('error', this.handleWindowError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logError('AppErrorBoundary.componentDidCatch', { error, errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title="Algo deu errado"
          message="Encontramos um erro inesperado na aplicação. Tente novamente."
          actionLabel="Tentar novamente"
          onAction={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
