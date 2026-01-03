# Quick Start Guide: API Automation Testing (Pure Playwright)

**Version**: 0.1.0

## Prerequisites

- Node.js 18+
- Write Service running (default: `http://localhost:8080`)
- Basic knowledge of TypeScript and API testing

## Installation

```bash
# Navigate to POC directory
cd api-tests-poc

# Install dependencies
npm install

# Install Playwright browsers (optional, for UI mode)
npx playwright install --with-deps chromium
```

## Configuration

Create `.env` file (copy from `.env.example`):

```bash
API_BASE_URL=http://localhost:8080/api/v1
```

## Your First Test

Create a test file `tests/workflows/my-first-test.spec.ts`:

### Using Generated Clients (Recommended)

```typescript
import { test, expect } from '../../fixtures/api-clients';

test('My First API Test', async ({ writeClient }) => {
  let routineId: number | undefined;

  try {
    // Type-safe API call with autocomplete
    const response = await writeClient.routines.createRoutine({
      name: `Test Routine ${Date.now()}`,
      isActive: true,
    });

    expect(response.status).toBe(201);

    // Typed response - response.data is RoutineResponse
    const routine = response.data;
    routineId = routine.id;

    expect(routine.id).toBeDefined();
    expect(routine.name).toContain('Test Routine');
  } catch (error: any) {
    // Handle axios errors
    if (error.response) {
      console.error(`API Error: ${error.response.status}`, error.response.data);
      throw error;
    }
    throw error;
  } finally {
    // Cleanup
    if (routineId) {
      await writeClient.routines.deleteRoutine(routineId);
    }
  }
});
```

### Using Pure Playwright (Alternative)

```typescript
import { test, expect } from '@playwright/test';

test('My First API Test', async ({ request, baseURL }) => {
  let resourceId: number | undefined;

  try {
    const response = await request.post(`${baseURL}/routines`, {
      data: {
        name: `Test Routine ${Date.now()}`,
        isActive: true,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const routine = await response.json();
    resourceId = routine.id;

    expect(routine.id).toBeDefined();
    expect(routine.name).toContain('Test Routine');
  } finally {
    // Cleanup
    if (resourceId) {
      await request.delete(`${baseURL}/routines/${resourceId}`);
    }
  }
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/workflows/my-first-test.spec.ts

# Run in UI mode (interactive)
npm run test:ui

# Run in debug mode
npm run test:debug

# View HTML report
npm run test:report
```

## Common Patterns

### Multi-Step Workflow with Generated Clients

```typescript
import { test, expect } from '../../fixtures/api-clients';

test('Multi-Step Workflow', async ({ writeClient }) => {
  let routineId: number | undefined;

  try {
    // Step 1: Create resource (type-safe)
    const response1 = await writeClient.routines.createRoutine({
      name: `Test ${Date.now()}`,
      isActive: true,
    });
    expect(response1.status).toBe(201);
    const routine = response1.data; // Typed as RoutineResponse
    routineId = routine.id;

    // Step 2: Use resource from step 1 (type-safe)
    const response2 = await writeClient.workoutDays.createWorkoutDay({
      routineId, // Type: number
      dayNumber: 1,
      dayName: 'Day 1',
    });
    expect(response2.status).toBe(201);
    const day = response2.data; // Typed as WorkoutDayResponse

    // Validate relationship
    expect(day.routineId).toBe(routineId);
  } finally {
    // Cleanup
    if (routineId) {
      await writeClient.routines.deleteRoutine(routineId);
    }
  }
});
```

### Multi-Step Workflow with Pure Playwright

```typescript
test('Multi-Step Workflow', async ({ request, baseURL }) => {
  let routineId: number | undefined;

  try {
    // Step 1: Create resource
    const response1 = await request.post(`${baseURL}/routines`, {
      data: { name: `Test ${Date.now()}`, isActive: true },
    });
    expect(response1.status()).toBe(201);
    const routine = await response1.json();
    routineId = routine.id;

    // Step 2: Use resource from step 1
    const response2 = await request.post(`${baseURL}/workout-days`, {
      data: { routineId, dayNumber: 1, dayName: 'Day 1' },
    });
    expect(response2.status()).toBe(201);
    const day = await response2.json();

    // Validate relationship
    expect(day.routineId).toBe(routineId);
  } finally {
    // Cleanup
    if (routineId) {
      await request.delete(`${baseURL}/routines/${routineId}`);
    }
  }
});
```

### Response Validation with Generated Clients

```typescript
import { test, expect } from '../../fixtures/api-clients';

test('Response Validation', async ({ writeClient }) => {
  const response = await writeClient.routines.createRoutine({
    name: `Test ${Date.now()}`,
    isActive: true,
  });

  // Status code validation
  expect(response.status).toBe(201);

  // Typed response body validation
  const routine = response.data; // Type: RoutineResponse
  expect(routine.id).toBeDefined();
  expect(routine.id).toBeGreaterThan(0);
  expect(routine.name).toContain('Test');
  expect(routine.isActive).toBe(true);
  expect(routine.createdAt).toBeDefined();
});
```

### Response Validation with Pure Playwright

```typescript
test('Response Validation', async ({ request, baseURL }) => {
  const response = await request.post(`${baseURL}/routines`, {
    data: { name: `Test ${Date.now()}`, isActive: true },
  });

  // Status code validation
  expect(response.status()).toBe(201);

  // Response body validation
  const data = await response.json();
  expect(data.id).toBeDefined();
  expect(data.id).toBeGreaterThan(0);
  expect(data.name).toContain('Test');
  expect(data.isActive).toBe(true);
  expect(data.createdAt).toBeDefined();
});
```

### Error Handling with Generated Clients

```typescript
import { test, expect } from '../../fixtures/api-clients';

test('Error Handling', async ({ writeClient }) => {
  try {
    // Test error response
    await writeClient.routines.createRoutine({
      name: '', // Invalid: empty name
      isActive: true,
    });
    
    // Should not reach here
    expect(true).toBe(false);
  } catch (error: any) {
    // Handle axios errors
    if (error.response) {
      expect(error.response.status).toBe(400);
      const errorData = error.response.data; // Already parsed JSON
      expect(errorData.message || errorData.code).toBeDefined();
    } else {
      throw error;
    }
  }
});
```

### Error Handling with Pure Playwright

```typescript
test('Error Handling', async ({ request, baseURL }) => {
  // Test error response
  const response = await request.post(`${baseURL}/routines`, {
    data: { name: '' }, // Invalid: empty name
  });

  expect(response.status()).toBe(400);
  const error = await response.json();
  expect(error.message).toBeDefined();
});
```

### Cleanup on Failure with Generated Clients

```typescript
import { test, expect } from '../../fixtures/api-clients';

test('Cleanup on Failure', async ({ writeClient }) => {
  let routineId: number | undefined;

  try {
    const response = await writeClient.routines.createRoutine({
      name: `Test ${Date.now()}`,
      isActive: true,
    });
    routineId = response.data.id;

    // Intentionally fail
    throw new Error('Test failure');
  } catch (error) {
    // Handle error
    expect(error).toBeDefined();
  } finally {
    // Cleanup always runs, even on failure
    if (routineId) {
      await writeClient.routines.deleteRoutine(routineId);
    }
  }
});
```

### Cleanup on Failure with Pure Playwright

```typescript
test('Cleanup on Failure', async ({ request, baseURL }) => {
  let resourceId: number | undefined;

  try {
    const response = await request.post(`${baseURL}/routines`, {
      data: { name: `Test ${Date.now()}`, isActive: true },
    });
    resourceId = (await response.json()).id;

    // Intentionally fail
    throw new Error('Test failure');
  } catch (error) {
    // Handle error
    expect(error).toBeDefined();
  } finally {
    // Cleanup always runs, even on failure
    if (resourceId) {
      await request.delete(`${baseURL}/routines/${resourceId}`);
    }
  }
});
```

## Best Practices

1. **Always use `baseURL` fixture** - Don't hardcode URLs
2. **Check response status** - Use `response.ok()` or `response.status()` before parsing JSON
3. **Cleanup in `finally` blocks** - Ensures cleanup runs even on failure
4. **Use unique identifiers** - Use timestamps or UUIDs to avoid conflicts
5. **Test isolation** - Each test should be independent

## Troubleshooting

### Tests Fail with Connection Errors

- Verify Write Service is running: `curl http://localhost:8080/health`
- Check `API_BASE_URL` in `.env` file
- Verify network connectivity

### JSON Parse Errors (Pure Playwright)

- Always check `response.ok()` before calling `response.json()`
- Check response status code
- Log response body for debugging: `console.log(await response.text())`

### Axios Errors (Generated Clients)

- Check `error.response.status` for HTTP status codes
- Check `error.response.data` for error details (already parsed JSON)
- Handle network errors with `error.request` check
- Log full error for debugging: `console.error(error)`

### Cleanup Not Working

- Ensure cleanup code is in `finally` block
- Check that resource IDs are stored correctly
- Verify API permissions for DELETE requests
- For generated clients: Use `writeClient.routines.deleteRoutine(routineId)`

## Next Steps

- Read [README.md](../README.md) for overview and quick start
- Explore example tests in `tests/workflows/`
- Review [Playwright API Testing Docs](https://playwright.dev/docs/api-testing)
