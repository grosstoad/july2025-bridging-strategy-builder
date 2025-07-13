# Fetching

This guide demonstrates a recommended pattern for implementing API calls in React applications using custom hooks.

## Basic structure

Custom API hooks should return four main elements:

- `results`: Stores the API response data as an array or object
- `error`: Handles error messages (string or null)
- `isLoading`: Tracks the loading state (boolean)
- `action`: Function to trigger the API call (e.g. search, fetch, submit)

## Key features

Well-designed API hooks should be framework-agnostic and reusable:

- Empty input handling: Clear results and stop loading when inputs are invalid
- Debounced requests: Minimize network calls during rapid user input
- Request cancellation: Cancel in-flight requests to prevent stale data
- Unified state management: Consistent state interface across all hooks
- Robust error handling: Distinguish between network errors and cancelled requests
- Type-safe mapping: Use interfaces for API responses with domain transforms
- Graceful fallbacks: Provide sensible defaults for missing data

## Best practices

- HTTP client: Use native fetch API for simplicity and broad browser support
- URL encoding: Always encode dynamic URL parameters properly
- Response validation: Check response status and handle errors appropriately
- Type safety: Define clear interfaces for API responses and hook returns
- Data transformation: Normalize API data before setting component state
- Request coordination: Use debouncing and cancellation to avoid race conditions
- Empty state handling: Clear results when queries become invalid
- Error logging: Log technical errors while showing user-friendly messages
- Graceful defaults: Handle missing or malformed API response fields

## Implementation patterns

### HTTP client selection

- Use native fetch API for modern browser compatibility and simplicity
- Avoid heavy HTTP libraries unless specific features are required
- Leverage fetch with AbortController for request cancellation
- Handle response parsing and error checking manually for full control

### State management

- Initialize results as empty arrays/objects rather than null
- Use boolean flags for loading states
- Store error messages as strings or null
- Implement proper cleanup on component unmount

### Request handling

- Implement debouncing for user input-driven requests
- Use AbortController for request cancellation
- Handle empty or invalid inputs gracefully
- Provide clear error messages for different failure scenarios

### Type safety

- Define separate interfaces for API responses and component data
- Use generic types where appropriate for reusability
- Transform API data to match component requirements
- Provide fallback values for optional fields

## Additional considerations

- Retry logic: Implement backoff strategies for unreliable networks
- Request timeouts: Set appropriate timeouts for different API operations
- Caching: Cache recent results to improve performance and reduce API calls
- Loading states: Design appropriate loading indicators for different contexts
- Error boundaries: Handle unexpected failures at the component level
- Accessibility: Ensure loading and error states are announced to screen readers
