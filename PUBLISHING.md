# Publishing to NPM Guide

## Package Information
- **Package Name**: `bayarcash-ts-sdk`
- **Version**: 1.0.0
- **Package Size**: 25.7 kB
- **Total Files**: 72 files (all in dist/)

## Pre-Publishing Checklist

✅ Package.json configured with:
- Proper name, version, description
- Author information
- License (MIT)
- Keywords for discoverability
- Repository URLs (update these with your actual repo)
- Entry points (main, module, types)

✅ Build artifacts ready in `dist/`
✅ Tests passing (10/10)
✅ .npmignore configured
✅ README.md comprehensive
✅ LICENSE file present

## Step-by-Step Publishing Guide

### Step 1: Update Repository URLs (IMPORTANT!)

Before publishing, update the repository URLs in `package.json`:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_GITHUB_USERNAME/bayarcash-ts-sdk.git"
},
"homepage": "https://github.com/YOUR_GITHUB_USERNAME/bayarcash-ts-sdk#readme",
"bugs": {
  "url": "https://github.com/YOUR_GITHUB_USERNAME/bayarcash-ts-sdk/issues"
}
```

### Step 2: Create NPM Account (if you don't have one)

1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email address

### Step 3: Login to NPM via CLI

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

Verify you're logged in:
```bash
npm whoami
```

### Step 4: Final Pre-Publish Checks

```bash
# Clean and rebuild
npm run build

# Run tests
npm test

# Check package contents (dry run)
npm pack --dry-run
```

### Step 5: Publish to NPM

For first-time publishing:
```bash
npm publish
```

If the package name is taken, you can publish as a scoped package:
```bash
# Update package name in package.json to @yourusername/bayarcash-ts-sdk
npm publish --access public
```

### Step 6: Verify Publication

1. Check on NPM: https://www.npmjs.com/package/bayarcash-ts-sdk
2. Test installation in a new project:

```bash
mkdir test-install
cd test-install
npm init -y
npm install bayarcash-ts-sdk

# Test import
node -e "const { Bayarcash } = require('bayarcash-ts-sdk'); console.log(Bayarcash)"
```

## Publishing Updates

### Patch Release (1.0.0 → 1.0.1)
Bug fixes, minor changes:
```bash
npm version patch
npm publish
```

### Minor Release (1.0.0 → 1.1.0)
New features (backward compatible):
```bash
npm version minor
npm publish
```

### Major Release (1.0.0 → 2.0.0)
Breaking changes:
```bash
npm version major
npm publish
```

## Publishing as Scoped Package

If `bayarcash-ts-sdk` is already taken, publish under your username:

1. Update `package.json`:
```json
{
  "name": "@yourusername/bayarcash-ts-sdk",
  ...
}
```

2. Publish:
```bash
npm publish --access public
```

3. Users will install with:
```bash
npm install @yourusername/bayarcash-ts-sdk
```

## Automated Publishing with GitHub Actions (Optional)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then add your NPM token to GitHub Secrets.

## Common Issues

### Issue: Package name already taken
**Solution**: Use scoped package (`@username/package-name`)

### Issue: Authentication error
**Solution**: Run `npm logout` then `npm login` again

### Issue: 2FA required
**Solution**:
1. Enable 2FA on npmjs.com
2. Use OTP: `npm publish --otp=123456`

### Issue: Missing files in published package
**Solution**: Check `.npmignore` and `files` field in package.json

## Post-Publishing Checklist

After successful publishing:

- [ ] Verify package on npmjs.com
- [ ] Test installation: `npm install bayarcash-ts-sdk`
- [ ] Update GitHub repository with npm badge
- [ ] Create a GitHub release
- [ ] Share on social media/forums
- [ ] Update documentation website (if any)

## NPM Badge for README

Add this to your README.md:

```markdown
[![npm version](https://badge.fury.io/js/bayarcash-ts-sdk.svg)](https://www.npmjs.com/package/bayarcash-ts-sdk)
[![npm downloads](https://img.shields.io/npm/dm/bayarcash-ts-sdk.svg)](https://www.npmjs.com/package/bayarcash-ts-sdk)
```

## Security Best Practices

1. **Enable 2FA** on your NPM account
2. **Never commit** your NPM token
3. **Use .npmrc** with `//registry.npmjs.org/:_authToken=` in .gitignore
4. **Review** package contents before publishing
5. **Verify** all secrets are in .npmignore

## Quick Commands Reference

```bash
# Login
npm login

# Check login status
npm whoami

# Check package contents
npm pack --dry-run

# Publish
npm publish

# Publish scoped package
npm publish --access public

# Update version
npm version patch|minor|major

# Unpublish (within 72 hours)
npm unpublish bayarcash-ts-sdk@1.0.0

# Deprecate a version
npm deprecate bayarcash-ts-sdk@1.0.0 "Please use version 1.0.1"
```

## Support

If you encounter issues:
- NPM Support: https://www.npmjs.com/support
- NPM Documentation: https://docs.npmjs.com/
- GitHub Issues: https://github.com/npm/cli/issues

## Next Steps After Publishing

1. **Monitor downloads**: Check npm stats regularly
2. **Respond to issues**: Set up GitHub issue templates
3. **Accept PRs**: Review and merge community contributions
4. **Keep dependencies updated**: Use `npm outdated`
5. **Publish updates**: Follow semantic versioning
6. **Write blog posts**: Share your SDK with the community
