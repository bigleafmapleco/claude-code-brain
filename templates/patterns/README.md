# Pattern Templates

This directory contains reusable code patterns that Claude Code Brain can learn from and apply across projects. These are battle-tested solutions to common programming challenges.

## Purpose

Pattern templates provide:
- Reusable code solutions
- Best practice implementations
- Common problem solvers
- Performance optimizations
- Security patterns

## Directory Structure

```
templates/patterns/
├── error-handling/
│   ├── try-catch-async.js
│   ├── error-boundary.tsx
│   └── api-error-handler.ts
├── authentication/
│   ├── jwt-middleware.js
│   ├── session-management.ts
│   └── rbac-check.ts
├── data-fetching/
│   ├── swr-fetcher.ts
│   ├── react-query-setup.ts
│   └── api-client.ts
├── state-management/
│   ├── zustand-store.ts
│   ├── context-provider.tsx
│   └── reducer-pattern.ts
└── README.md
```

## Pattern Format

Each pattern should include:

### 1. Metadata Header
```javascript
/**
 * Pattern: Async Error Handler
 * Category: error-handling
 * Use Case: Wrapping async functions with consistent error handling
 * Dependencies: None
 * Complexity: Simple
 * 
 * Description:
 * Provides consistent error handling for async operations with
 * logging, user-friendly messages, and error tracking.
 */
```

### 2. The Pattern Code
```javascript
export const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      // Log to error tracking service
      console.error('[AsyncHandler]', error);
      
      // Return user-friendly error
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        code: error.code || 'UNKNOWN_ERROR'
      };
    }
  };
};
```

### 3. Usage Example
```javascript
// Usage Example:
const fetchUserData = asyncHandler(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
});

// In component:
const userData = await fetchUserData(123);
if (!userData.success) {
  showError(userData.error);
}
```

## Pattern Categories

### error-handling/
- Try-catch wrappers
- Error boundaries
- Validation errors
- API error standardization

### authentication/
- JWT verification
- Session management
- Permission checking
- OAuth flows

### data-fetching/
- API clients
- Caching strategies
- Optimistic updates
- Pagination helpers

### state-management/
- Store patterns
- Context providers
- Reducer patterns
- State machines

### performance/
- Debouncing/throttling
- Memoization
- Lazy loading
- Virtual scrolling

### security/
- Input sanitization
- XSS prevention
- CSRF protection
- Rate limiting

### ui-patterns/
- Modal management
- Toast notifications
- Form handling
- Drag and drop

### testing/
- Test utilities
- Mock factories
- Test helpers
- Fixture generators

## Creating New Patterns

### Pattern Template
```javascript
/**
 * Pattern: [Pattern Name]
 * Category: [Category]
 * Use Case: [When to use this]
 * Dependencies: [Required packages]
 * Complexity: [Simple|Moderate|Advanced]
 * 
 * Description:
 * [Detailed explanation of what this pattern does and why]
 * 
 * Benefits:
 * - [Benefit 1]
 * - [Benefit 2]
 * 
 * Tradeoffs:
 * - [Tradeoff 1]
 * - [Tradeoff 2]
 */

// Pattern implementation
export const patternName = () => {
  // Implementation
};

// Usage example
// [Show how to use this pattern]

// Test example (optional)
// [Show how to test this pattern]
```

## Pattern Selection Criteria

Include patterns that are:
1. **Reusable**: Applicable across multiple projects
2. **Proven**: Battle-tested in production
3. **Clear**: Easy to understand and implement
4. **Valuable**: Solve real problems
5. **Maintainable**: Don't create technical debt

## How Claude Code Brain Uses Patterns

1. **Learning**: When Brain encounters good solutions, it can save them as patterns
2. **Suggesting**: When facing similar problems, Brain suggests relevant patterns
3. **Applying**: Brain can adapt patterns to current project style
4. **Evolution**: Patterns improve over time based on usage

## Example Pattern: React Error Boundary

```typescript
/**
 * Pattern: React Error Boundary
 * Category: error-handling
 * Use Case: Catching React component errors gracefully
 * Dependencies: react
 * Complexity: Moderate
 * 
 * Description:
 * Prevents entire app crash when a component throws an error.
 * Shows fallback UI and logs errors for debugging.
 */

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
// <ErrorBoundary fallback={<ErrorPage />}>
//   <App />
// </ErrorBoundary>
```

## Contributing Patterns

When contributing new patterns:
1. Ensure it's genuinely reusable
2. Include comprehensive documentation
3. Add usage examples
4. Consider edge cases
5. Test thoroughly
6. Follow project style guide