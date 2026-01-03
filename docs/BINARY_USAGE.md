# Binary Distribution Guide

This guide explains how to use Gate Keeper as a distributable binary.

## Building Binaries

### Prerequisites

```bash
npm install
```

### Build All Platforms

```bash
npm run build:binary
```

This creates binaries in `dist/`:
- `dist/gate-keeper-linux` (Linux)
- `dist/gate-keeper-macos` (macOS)
- `dist/gate-keeper-win.exe` (Windows)

### Build Specific Platform

```bash
# Linux only
npm run build:binary:linux

# macOS only
npm run build:binary:macos

# Windows only
npm run build:binary:windows
```

## Using the Binary

### Basic Usage

```bash
# Make binary executable (Linux/macOS)
chmod +x gate-keeper

# Run all tests
./gate-keeper

# Run with Playwright filters
./gate-keeper test --grep "Create Routine"
./gate-keeper test --project=api-tests
./gate-keeper test --grep @smoke --workers=2
```

### Custom Base URL

```bash
# Via environment variable
API_BASE_URL=http://api.example.com ./gate-keeper test

# Or set in shell
export API_BASE_URL=http://api.example.com
./gate-keeper test
```

### All Playwright Options Supported

The binary passes through all Playwright CLI arguments:

```bash
# UI mode
./gate-keeper test --ui

# Debug mode
./gate-keeper test --debug

# Specific test file
./gate-keeper test tests/workflows/create-and-get-routine.spec.ts

# Multiple filters
./gate-keeper test --grep "routine" --project=api-tests --workers=4

# Custom reporter
./gate-keeper test --reporter=json

# Show HTML report
./gate-keeper show-report
```

## Distribution

### Option 1: Direct Binary Distribution

1. Build binaries for target platforms
2. Upload to release artifacts (GitHub Releases, S3, etc.)
3. Consumers download and use directly

```bash
# Consumer downloads binary
curl -L https://github.com/your-org/gate-keeper/releases/download/v1.0.0/gate-keeper-macos -o gate-keeper
chmod +x gate-keeper

# Consumer runs tests
API_BASE_URL=http://api.example.com ./gate-keeper test --grep @smoke
```

### Option 2: npm Package Distribution

Publish as npm package with binary:

```bash
npm publish
```

Consumers install:

```bash
npm install -g @chauhaidang/gate-keeper
xq-keeper test --grep "Create Routine"
```

### Option 3: Docker Image

Package as Docker image:

```dockerfile
FROM node:18-alpine
COPY dist/gate-keeper-linux /usr/local/bin/gate-keeper
RUN chmod +x /usr/local/bin/gate-keeper
ENTRYPOINT ["gate-keeper"]
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Download Gate Keeper
  run: |
    curl -L https://github.com/your-org/gate-keeper/releases/download/v1.0.0/gate-keeper-linux -o gate-keeper
    chmod +x gate-keeper

- name: Run API Tests
  env:
    API_BASE_URL: ${{ env.API_URL }}
  run: |
    ./gate-keeper test --grep "@smoke" --reporter=json --workers=2
```

### GitLab CI

```yaml
test:
  script:
    - curl -L https://github.com/your-org/gate-keeper/releases/download/v1.0.0/gate-keeper-linux -o gate-keeper
    - chmod +x gate-keeper
    - API_BASE_URL=$API_URL ./gate-keeper test --grep @smoke
```

## How It Works

### Binary Structure

The binary includes:
- Test files (`tests/`)
- Fixtures (`fixtures/`)
- Configuration (`playwright.config.ts`)
- Generated API clients (`generated-clients/`)
- Wrapper scripts (`bin/`, `lib/`)

### Playwright Execution

The binary wrapper:
1. Passes all arguments directly to Playwright CLI
2. Sets `API_BASE_URL` environment variable (defaults to `http://localhost:8080`)
3. Executes Playwright with the provided arguments

### Playwright Availability

**✅ Playwright is fully bundled in the binary!**

The binary includes `@playwright/test` and all its dependencies. Consumers **do NOT need** to install Playwright separately.

- ✅ No `npm install @playwright/test` required
- ✅ No `npx playwright install` required  
- ✅ Fully self-contained binary
- ✅ Works on any system with the binary (no Node.js/npm needed)

## Troubleshooting

### "Playwright not bundled in binary"

This error means Playwright wasn't included when building the binary. To fix:

1. Ensure `@playwright/test` is in `dependencies` (not `devDependencies`)
2. Rebuild the binary: `npm run build:binary`
3. Check that `pkg.assets` includes `node_modules/@playwright/test/**/*`

### "Missing module" errors

If you see module not found errors, the binary may be missing some dependencies. Check:
- All dependencies are in `dependencies` (not `devDependencies`)
- `pkg.scripts` includes all required JavaScript files
- `pkg.assets` includes all required assets

### "Tests not found"

Ensure the binary includes test files. Check `pkg.assets` in `package.json`.

### "API client errors"

Ensure generated clients are included in the binary. Check `pkg.assets` includes `generated-clients/**/*`.

### Binary too large

Consider:
- Excluding unnecessary files from `pkg.assets`
- Using peer dependencies for large packages
- Distributing as Docker image instead

## Examples

### Run Smoke Tests

```bash
./gate-keeper test --grep @smoke
```

### Run Specific Workflow

```bash
./gate-keeper test tests/workflows/create-and-get-routine.spec.ts
```

### Run with Custom Config

```bash
API_BASE_URL=http://staging.example.com \
./gate-keeper test \
  --project=api-tests \
  --workers=4 \
  --reporter=html
```

### Generate Test Report

```bash
# Run tests with HTML reporter
./gate-keeper test --reporter=html

# View report
./gate-keeper show-report
```

