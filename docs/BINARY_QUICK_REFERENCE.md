# Binary Quick Reference

Quick reference for using Gate Keeper binary.

## Installation

```bash
# Download binary (example)
curl -L https://github.com/your-org/gate-keeper/releases/download/v1.0.0/gate-keeper-macos -o gate-keeper
chmod +x gate-keeper
```

## Common Commands

### Run All Tests
```bash
./gate-keeper
```

### Filter by Test Name
```bash
./gate-keeper test --grep "Create Routine"
./gate-keeper test --grep "routine"
```

### Filter by Tag
```bash
./gate-keeper test --grep @smoke
./gate-keeper test --grep @regression
```

### Run Specific Project
```bash
./gate-keeper test --project=api-tests
```

### Run Specific Test File
```bash
./gate-keeper test tests/workflows/create-and-get-routine.spec.ts
```

### Set Custom Base URL
```bash
# Use environment variable
API_BASE_URL=http://api.example.com ./gate-keeper test
```

### Parallel Execution
```bash
./gate-keeper test --workers=4
```

### Interactive Modes
```bash
# UI mode
./gate-keeper test --ui

# Debug mode
./gate-keeper test --debug
```

### Custom Reporter
```bash
./gate-keeper test --reporter=json
./gate-keeper test --reporter=html
```

### View HTML Report
```bash
./gate-keeper show-report
```

## Combining Options

```bash
# Multiple filters
./gate-keeper test --grep "routine" --project=api-tests --workers=2

# Custom URL with filters
API_BASE_URL=http://staging.example.com ./gate-keeper test --grep @smoke

# Full example
API_BASE_URL=http://api.example.com ./gate-keeper \
  test \
  --grep "Create" \
  --project=api-tests \
  --workers=4 \
  --reporter=html
```

## Help

```bash
./gate-keeper --help
```

## Version

```bash
./gate-keeper --version
```

