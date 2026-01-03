# npm Global Installation Guide

The simplest way to use XQ Keeper is via npm global installation.

## Installation

### Install Globally

```bash
npm install -g @xq-fitness/gate-keeper
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

# Custom base URL
xq-keeper --base-url=http://api.example.com test --grep @smoke
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
npm update -g @xq-fitness/gate-keeper
```

## Uninstalling

```bash
npm uninstall -g @xq-fitness/gate-keeper
```

## Local Installation (Alternative)

You can also install locally in a project:

```bash
npm install --save-dev @xq-fitness/gate-keeper
npx xq-keeper test
```

## CI/CD Usage

### GitHub Actions

```yaml
- name: Install XQ Keeper
  run: npm install -g @xq-fitness/gate-keeper

- name: Run API Tests
  run: |
    xq-keeper \
      --base-url=${{ env.API_URL }} \
      test \
      --grep "@smoke" \
      --workers=2
```

### GitLab CI

```yaml
test:
  before_script:
    - npm install -g @xq-fitness/gate-keeper
  script:
    - xq-keeper --base-url=$API_URL test --grep @smoke
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
npm uninstall -g @xq-fitness/gate-keeper
npm install -g @xq-fitness/gate-keeper
```

### Permission Errors

On Linux/macOS, you may need `sudo`:

```bash
sudo npm install -g @xq-fitness/gate-keeper
```

Or configure npm to use a different directory (recommended):

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g @xq-fitness/gate-keeper
```

