import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch and handle React errors gracefully
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error tracking service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can integrate with error tracking services here
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        
        <Text style={styles.title}>Oops! Something went wrong</Text>
        
        <Text style={styles.message}>
          We encountered an unexpected error. Please try again.
        </Text>

        {__DEV__ && (
          <View style={styles.errorDetails}>
            <Text style={styles.errorTitle}>Error Details (Dev Only):</Text>
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={resetError}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  errorDetails: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
    width: '100%',
  },
  errorTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    minWidth: 150,
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
  },
});
