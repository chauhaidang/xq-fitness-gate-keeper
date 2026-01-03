# npm Global Installation Guide

The simplest way to use XQ Keeper is via npm global installation.

## Installation

### Install Globally

```bash
npm install -g @chauhaidang/gate-keeper
```

This installs:
- `xq-keeper` command globally
- `@playwright/test` as a dependency (automatically installed)
- All test files and fixtures

### Verify Installation

```bash
xq-keeper --version
xq-keeper --help
```

## Usage

Once installed globally, use `xq-keeper` from anywhere:

```bash
# Run all tests
xq-keeper

# Run with filters
xq-keeper test --grep "Create Routine"
xq-keeper test --project=api-tests --workers=4

# Custom base URL via environment variable
API_BASE_URL=http://api.example.com xq-keeper test --grep @smoke
```

## How It Works

When you install globally:
1. npm installs the package to your global `node_modules`
2. Creates `xq-keeper` command in your PATH
3. Installs `@playwright/test` as a dependency
4. All test files are included in the package

## Benefits

✅ **Simple**: One command to install  
✅ **Standard**: Uses standard npm workflow  
✅ **Automatic**: Playwright installed automatically  
✅ **Updates**: Easy to update with `npm update -g`  
✅ **Works everywhere**: Use from any directory  

## Updating

```bash
npm update -g @chauhaidang/gate-keeper
```

## Uninstalling

```bash
npm uninstall -g @chauhaidang/gate-keeper
```

## Local Installation (Alternative)

You can also install locally in a project:

```bash
npm install --save-dev @chauhaidang/gate-keeper
npx xq-keeper test
```

## CI/CD Usage

### GitHub Actions

```yaml
- name: Install XQ Keeper
  run: npm install -g @chauhaidang/gate-keeper

- name: Run API Tests
  env:
    API_BASE_URL: ${{ env.API_URL }}
  run: |
    xq-keeper test --grep "@smoke" --workers=2
```

### GitLab CI

```yaml
test:
  before_script:
    - npm install -g @chauhaidang/gate-keeper
  script:
    - API_BASE_URL=$API_URL xq-keeper test --grep @smoke
```

## Troubleshooting

### "Command not found: xq-keeper"

Make sure npm global bin is in your PATH:

```bash
# Check npm global prefix
npm config get prefix

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$(npm config get prefix)/bin:$PATH"
```

### "Playwright not found"

If you see Playwright errors, reinstall:

```bash
npm uninstall -g @chauhaidang/gate-keeper
npm install -g @chauhaidang/gate-keeper
```

### Permission Errors

On Linux/macOS, you may need `sudo`:

```bash
sudo npm install -g @chauhaidang/gate-keeper
```

Or configure npm to use a different directory (recommended):

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g @chauhaidang/gate-keeper
```

## Environment Variables

### API_BASE_URL

The API base URL can be configured via the `API_BASE_URL` environment variable:

```bash
# Set for single command
API_BASE_URL=http://api.example.com xq-keeper test

# Set in shell session
export API_BASE_URL=http://api.example.com
xq-keeper test

# Default value
xq-keeper test  # Uses http://localhost:8080
```

The default value is `http://localhost:8080` if not specified.

