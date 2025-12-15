# Performance Monitoring Guide

## Quick Access to Performance Dashboard

### Method 1: URL Parameter (Easiest)
Add `?debug=true` to any URL:
```
http://localhost:5173/?debug=true
```

### Method 2: Browser Console
Open browser console (F12) and run:
```javascript
localStorage.setItem('debug', 'true');
// Refresh the page
```

### Method 3: Debug Panel Button
Look for the 🔧 button in the bottom-right corner of the screen when debug mode is enabled.

## Using the Performance Dashboard

1. **Enable Debug Mode** using any method above
2. **Click the 🔧 button** in bottom-right corner
3. **Click "📊 Performance Dashboard"**

## What You'll See

### Component Performance Table
- **Component**: Name of React component
- **Count**: How many times it mounted/rendered
- **Avg Time**: Average mount/render time in milliseconds
- **Color Coding**:
  - 🟢 Green: < 500ms (Good)
  - 🟡 Yellow: 500-1000ms (Moderate)
  - 🔴 Red: > 1000ms (Slow - needs attention)

### Operation Performance Table
- **Operation**: Specific operations (API calls, calculations, etc.)
- **Count**: How many times executed
- **Avg**: Average execution time
- **Max**: Maximum execution time recorded

### Recent Performance Events
- Real-time list of performance measurements
- Shows slowest operations first
- Includes component and operation context

## Performance Thresholds

### Component Performance
- **Good**: < 500ms mount time
- **Moderate**: 500-1000ms mount time
- **Poor**: > 1000ms mount time

### Operation Performance
- **Good**: < 1000ms execution time
- **Moderate**: 1000-2000ms execution time
- **Poor**: > 2000ms execution time

## Common Performance Issues

### Slow Components
- Large component trees
- Heavy computations in render
- Inefficient re-renders
- Missing React.memo or useMemo

### Slow Operations
- API calls without timeout
- Large data processing
- Inefficient algorithms
- Network latency

## Monitoring in Action

### Example: Book Search Performance
1. Go to Home page
2. Enable debug mode: `?debug=true`
3. Open Performance Dashboard
4. Search for books
5. Watch the dashboard update with:
   - `BookService.searchBooks` operation time
   - `SearchForm` component performance
   - API response times

### Example: Page Navigation
1. Navigate between pages (Home → My Books → My Notes)
2. Check dashboard for:
   - Page component mount times
   - Route transition performance
   - Data loading times

## Automatic Performance Alerts

The system automatically logs warnings for:
- Components taking > 1000ms to mount
- Operations taking > 2000ms to complete
- API calls timing out

Check browser console for these warnings.

## Exporting Performance Data

### From Dashboard
Click "Export" button to download JSON file with performance data.

### From Console
```javascript
// Get recent performance logs
logger.getRecentLogs(100).filter(log => log.type === 'performance');

// Get specific component performance
logger.getRecentLogs(100).filter(log => log.component === 'Home');
```

## Performance Optimization Tips

### Based on Dashboard Data

1. **Slow Components**:
   - Use React.memo for pure components
   - Implement useMemo for expensive calculations
   - Split large components into smaller ones

2. **Slow Operations**:
   - Add loading states
   - Implement caching
   - Use debouncing for user inputs
   - Optimize API calls

3. **Memory Issues**:
   - Check for memory leaks
   - Clean up event listeners
   - Dispose of subscriptions

## Real-time Monitoring

The dashboard updates automatically as you use the app:
- Navigate between pages
- Search for books
- Add/edit notes
- Perform any user actions

Watch the performance metrics change in real-time to identify bottlenecks.

## Troubleshooting

### Dashboard Not Showing
1. Ensure debug mode is enabled
2. Check browser console for errors
3. Verify the 🔧 button is visible
4. Try refreshing the page

### No Performance Data
1. Use the app for a few minutes to generate data
2. Perform various actions (search, navigate, etc.)
3. Check if performance monitoring is enabled in environment

### Performance Issues
1. Check browser console for warnings
2. Look for red entries in the dashboard
3. Focus on operations > 2000ms
4. Monitor component mount times > 1000ms

## Best Practices

1. **Regular Monitoring**: Check dashboard weekly during development
2. **Baseline Metrics**: Record initial performance for comparison
3. **User Actions**: Test real user workflows
4. **Different Devices**: Monitor on various device types
5. **Network Conditions**: Test with slow/fast connections