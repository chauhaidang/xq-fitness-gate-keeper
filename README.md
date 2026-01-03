# Gate Keeper - API Automation Testing

**Status**: Proof of Concept  
**Version**: 0.1.0  
**Framework**: Playwright with Generated API Clients

## Overview

API automation testing framework using **Playwright** with **generated TypeScript API clients** for type safety and reduced boilerplate. The generated clients are created from OpenAPI specifications and provide full type safety.

## Features

- ✅ Playwright API testing with custom fixtures
- ✅ Generated API clients for type safety (read & write services)
- ✅ Multi-step workflow tests
- ✅ Response validation with Playwright's expect API
- ✅ Automatic cleanup using try/finally blocks
- ✅ Playwright HTML reports
- ✅ Full TypeScript type safety (autocomplete, compile-time checks)
- ✅ **Binary distribution support** - Package as single executable for easy distribution

## Quick Start

### Prerequisites

- Node.js 18+
- Services running (configure via `API_BASE_URL`)

### Installation

```bash
npm install
npx playwright install --with-deps chromium
```

### Configuration

Create `.env` file:

```bash
API_BASE_URL=http://localhost:8080/api/v1
```

### Running Tests

```bash
# Run all tests
npm test

# Run in UI mode
npm run test:ui

# Run in debug mode
npm run test:debug

# View HTML report
npm run test:report
```

## Example Test

```typescript
import { test, expect } from '../fixtures/api-clients';

test('Create Routine', async ({ xqWrite, xqRead }) => {
  let routineId: number | undefined;

  try {
    // Type-safe API call
    const response = await xqWrite.routines.createRoutine({
      name: `Test Routine ${Date.now()}`,
      isActive: true,
    });

    expect(response.status).toBe(201);
    routineId = response.data.id;

    // Read back using read service
    const getResponse = await xqRead.routines.getRoutineById(routineId);
    expect(getResponse.status).toBe(200);
  } finally {
    // Cleanup
    if (routineId) {
      await xqWrite.routines.deleteRoutine(routineId);
    }
  }
});
```

## Installation & Usage

### Global Installation (Recommended)

```bash
# Install globally
npm install -g @xq-fitness/gate-keeper

# Use from anywhere
xq-keeper test --grep "Create Routine"
xq-keeper --base-url=http://api.example.com test --grep @smoke
```

### Local Installation

```bash
# Install in your project
npm install --save-dev @xq-fitness/gate-keeper

# Use with npx
npx xq-keeper test
```

**All Playwright CLI options are supported!** The CLI passes through all arguments to Playwright:
- `--grep` for test filtering
- `--project` for project selection
- `--workers` for parallelization
- `--ui`, `--debug` for interactive modes
- And all other Playwright options

See **[npm Installation Guide](./docs/NPM_INSTALLATION.md)** for complete documentation.

### Binary Distribution (Optional)

For environments without npm, you can build a standalone binary:

```bash
npm run build:bin
```

See **[Binary Usage Guide](./docs/BINARY_USAGE.md)** for binary distribution details.

## Documentation

- **[Quick Start Guide](./docs/QUICKSTART.md)** - Detailed getting started guide with examples
- **[Binary Usage Guide](./docs/BINARY_USAGE.md)** - Complete guide for binary distribution and usage
- **[Full Documentation](./docs/)** - Complete documentation and best practices

## Project Structure

```
gate-keeper/
├── bin/                   # Binary entry point
│   └── run-tests.js      # CLI wrapper
├── lib/                   # Library code
│   └── playwright-wrapper.js  # Playwright execution wrapper
├── docs/                  # Documentation
├── fixtures/              # Playwright custom fixtures
│   └── api-clients.ts    # Generated client fixtures
├── tests/                 # Test files
│   └── workflows/        # Workflow test files
├── generated-clients/    # Generated API clients
├── playwright.config.ts   # Playwright configuration
└── package.json          # Dependencies
```

## References

- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
