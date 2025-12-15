# Error Handling & Logging System Guide

## Overview

This document describes the comprehensive error handling and logging system implemented for the Book Shelf application. The system provides graceful error recovery, detailed logging, performance monitoring, and user feedback collection.

## Architecture

### Core Components

1. **ErrorBoundary** - React error boundary with retry functionality
2. **Logger** - Structured logging with performance monitoring
3. **ErrorReporter** - External error reporting with offline support
4. **Error Categorization** - Automatic error type detection
5. **Performance Monitor** - Component and operation performance tracking

## Features

### ✅ Global Error Boundary
- Catches all React component errors
- Provides retry mechanism with exponential backoff
- Collects user feedback for error improvement
- Shows technical details for debugging
- Preserves error context across retries

### ✅ Structured Logging System
- Multiple log levels (ERROR, WARN, INFO, DEBUG)
- Session tracking with unique IDs
- Performance metrics collection
- User action tracking
- Log buffering for recent history
- Contextual information (URL, user agent, viewport)

### ✅ User-Friendly Error Messages
- Categorized error types (Network, API, Storage, etc.)
- Context-aware error messages
- Fallback message system
- Internationalization ready

### ✅ Error Reporting & Monitoring
- External error service integration
- Retry logic with exponential backoff
- Offline error queuing
- Error categorization and context
- Performance issue reporting
- User feedback collection

## Usage

### Basic Error Handling

```jsx
import { useErrorHandler } from '../hooks/useErrorHandler';

const MyComponent = () => {
  const { error, handleError, retry, clearError } = useErrorHandler();

  const performOperation = async () => {
    try {
      await someAsyncOperation();
    } catch (err) {
      handleError(err, {
        operation: 'my-operation',
        context: 'additional-info'
      });
    }
  };

  if (error) {
    return <ErrorFallback error={error} retry={() => retry(performOperation)} />;
  }

  return <div>My Component Content</div>;
};
```

### Performance Monitoring

```jsx
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

const MyComponent = () => {
  const { measureOperation } = usePerformanceMonitor('MyComponent');

  const expensiveOperation = measureOperation('expensiveOp', async () => {
    // Your expensive operation here
  });

  return <div>Component with performance monitoring</div>;
};
```

### Custom Error Boundaries

```jsx
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorFallback from '../components/ErrorFallback';

const MyPage = () => (
  <ErrorBoundary fallback={ErrorFallback}>
    <MyPageContent />
  </ErrorBoundary>
);
```

## Configuration

### Environment Variables

```env
# Error Reporting
VITE_ERROR_ENDPOINT=https://your-error-service.com/api/errors

# Logging
VITE_LOG_LEVEL=debug
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_MONITORING=true

# API Configuration
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3
```

### Logger Configuration

The logger automatically adjusts based on environment:
- **Production**: WARN level and above
- **Development**: DEBUG level and above

## Error Categories

| Category | Description | Examples |
|----------|-------------|----------|
| NETWORK | Network connectivity issues | Failed fetch, offline |
| API | Server-side errors | 4xx, 5xx responses |
| STORAGE | Local storage issues | Quota exceeded, access denied |
| VALIDATION | Input validation errors | Invalid form data |
| PERMISSION | Authorization errors | Access denied |
| TIMEOUT | Request timeouts | Slow API responses |
| GENERIC | Uncategorized errors | Unknown errors |

## Monitoring & Analytics

### Error Dashboard

Access the error monitoring dashboard by adding `?debug=true` to any URL or through the developer console:

```javascript
// Show error monitor
window.showErrorMonitor = true;
```

### Log Export

Export logs for analysis:
```javascript
// Export recent logs
logger.getRecentLogs(100);

// Export offline errors
JSON.parse(localStorage.getItem('offline_errors') || '[]');
```

## Best Practices

### 1. Error Handling
- Always use try-catch for async operations
- Provide meaningful error messages
- Include relevant context in error reports
- Use appropriate error categories

### 2. Logging
- Log user actions for debugging
- Include performance metrics for slow operations
- Use appropriate log levels
- Avoid logging sensitive information

### 3. Performance
- Monitor component mount/unmount times
- Track slow operations (>2s)
- Report performance issues automatically
- Use performance hooks for critical components

### 4. User Experience
- Provide retry mechanisms for transient errors
- Show offline indicators
- Collect user feedback for improvements
- Display user-friendly error messages

## Testing

Run error handling tests:
```bash
npm test errorHandling.test.jsx
```

Test coverage includes:
- Error boundary functionality
- Error categorization
- Logging system
- Performance monitoring
- User feedback collection

## Troubleshooting

### Common Issues

1. **Errors not being reported**
   - Check VITE_ERROR_ENDPOINT configuration
   - Verify network connectivity
   - Check browser console for reporter errors

2. **Performance monitoring not working**
   - Ensure VITE_ENABLE_PERFORMANCE_MONITORING=true
   - Check browser support for PerformanceObserver

3. **Offline errors not syncing**
   - Check network status component
   - Verify localStorage availability
   - Check error reporter flush logic

### Debug Mode

Enable debug mode for detailed logging:
```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## Integration with External Services

### Error Reporting Services

The system supports integration with:
- Sentry
- Bugsnag
- LogRocket
- Custom error endpoints

### Analytics Services

Performance and error metrics can be sent to:
- Google Analytics
- Mixpanel
- Custom analytics endpoints

## Future Enhancements

- [ ] Real-time error notifications
- [ ] Error trend analysis
- [ ] Automated error categorization with ML
- [ ] Integration with crash reporting services
- [ ] Advanced performance profiling
- [ ] Error impact scoring
- [ ] Automated error resolution suggestions

## Support

For questions or issues with the error handling system:
1. Check this documentation
2. Review test files for examples
3. Check browser console for debug information
4. Enable error monitoring dashboard for detailed analysis