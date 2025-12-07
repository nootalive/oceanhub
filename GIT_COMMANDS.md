# 🚀 Git Commands Reference - OceanHub Neon

## Current Status

```bash
# Vedi commit history
git log --oneline

# Risultato atteso:
# 3610f47 (HEAD -> master) docs: readme oauth + webhook setup + debug instructions
# c59af86 dev: debug mode + logger panel
# efba0d9 feat: discord connect demo e ranks sync
# 3b616a0 ui: neon hero, glow e microinteractions
```

## Deploy to GitHub (Once)

```bash
# 1. Create repo on GitHub
# https://github.com/new
# Name: oceanhub-sito

# 2. Add remote to local repo
git remote add origin https://github.com/YOUR_USERNAME/oceanhub-sito.git

# 3. Rename branch to main
git branch -M main

# 4. Push all commits
git push -u origin main

# 5. Done! Check: https://github.com/YOUR_USERNAME/oceanhub-sito
```

## Enable GitHub Pages

```bash
# 1. Go to: https://github.com/YOUR_USERNAME/oceanhub-sito/settings
# 2. Left menu → Pages
# 3. Source: main branch
# 4. Save
# 5. Wait 1-2 minutes
# 6. Site live at: https://YOUR_USERNAME.github.io/oceanhub-sito/
```

## Common Git Workflows

### Feature Development (Recommended)

```bash
# 1. Create feature branch from main
git checkout -b feature/new-feature

# 2. Make changes (edit files)
# ... edit files ...

# 3. Stage and commit (atomic)
git add .
git commit -m "feat: description of what I added"

# 4. Push to remote
git push origin feature/new-feature

# 5. Create Pull Request on GitHub
# - Go to https://github.com/YOUR_USERNAME/oceanhub-sito
# - Pull Requests tab
# - New Pull Request
# - Compare: feature/new-feature → main
# - Create PR

# 6. After review/approval, merge on GitHub
# OR merge locally:
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main

# 7. Delete feature branch (optional)
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### Quick Hotfix

```bash
# For urgent bug fixes, create hotfix branch
git checkout -b hotfix/urgent-bug

# Fix the issue
# ... edit files ...

# Commit
git commit -am "fix: critical bug in modal"

# Push and merge
git push origin hotfix/urgent-bug
# Create PR or:
git checkout main
git merge hotfix/urgent-bug
git push origin main
```

### Update from Main (While on Feature Branch)

```bash
# If main has new commits and you want them
git fetch origin
git rebase origin/main

# OR merge (safer for non-linear history)
git merge origin/main
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>

Types:
  feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that don't affect code meaning (formatting, missing semicolons, etc)
  refactor: Code change that neither fixes a bug nor adds a feature
  perf:     Code change that improves performance
  test:     Adding missing tests
  chore:    Changes to build process, dependencies, or tooling
  dev:      Development tools, configs, linting
  ci:       Changes to CI/CD configuration
```

### Examples

```bash
# Simple commit
git commit -m "feat: add oauth2 login button"

# Detailed commit
git commit -m "fix: modal not closing on escape key

- Added keydown listener for Escape
- Properly remove active class
- Test on mobile devices"

# Documentation
git commit -m "docs: update readme with oauth setup

- Add 4-step Discord App creation guide
- Include redirect URI configuration
- Add client_id replacement instructions"
```

## Useful Commands

### View Changes

```bash
# See uncommitted changes
git diff

# See staged changes
git git diff --staged

# See commits not yet pushed
git log origin/main..HEAD

# See file history
git log --oneline file.html
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- file.html

# Unstage file
git reset HEAD file.html

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Status and Info

```bash
# Current status
git status

# Show remotes
git remote -v

# Show branches
git branch -a

# Show branch I'm on
git branch

# Switch branch
git checkout main

# Create and switch
git checkout -b feature/new
```

### Clean Up

```bash
# Remove untracked files (careful!)
git clean -fd

# Remove untracked files AND ignored files
git clean -fdx

# Compress repository (optional)
git gc
```

## Issue Tracking Integration (Optional)

### Link Commit to Issue

```bash
# If you have GitHub issue #5:
git commit -m "fix: missing validation

Fixes #5"

# GitHub will auto-close issue when PR is merged
```

### Reference Issue in Commit

```bash
git commit -m "feat: oauth setup

See #3 for requirements"
```

## Collaboration Tips

### Before Pushing

```bash
# Always check what you're pushing
git log origin/main..HEAD

# Make sure tests pass (if you have them)
npm test  # or your test command
```

### Code Review

```bash
# Add feedback to PR
# On GitHub → Files Changed tab
# Click blue comment icon on line
# Write review comment
# Submit Review
```

### Merge Conflicts Resolution

```bash
# If you get conflict marker
# <<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>> branch-name

# 1. Edit file to keep what you want
# 2. Remove conflict markers
git add fixed-file.html

# 3. Complete merge
git commit -m "Merge: resolved conflicts in file.html"
```

## Recommended Workflow for OceanHub Team

```
1. main branch = always stable, production-ready
2. Feature branches = dev/features/XXX
3. Hotfix branches = hotfix/XXX
4. All changes via Pull Requests (no direct push to main)
5. Require 1 review before merge
6. Automatically deploy from main to GitHub Pages
7. Tag releases: git tag v1.0.0 then git push --tags
```

## Tag Releases (Optional but Recommended)

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0 - Neon Edition"

# Push tags
git push origin v1.0.0

# Or push all tags
git push origin --tags

# List tags
git tag -l
```

## GitHub Actions CI/CD (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        run: |
          git config user.email "bot@oceanhub.com"
          git config user.name "OceanHub Bot"
```

## Emergency: Revert Everything

```bash
# If you completely messed up, revert to last commit
git reset --hard HEAD

# Or revert to specific commit
git reset --hard 3b616a0

# Then force push (ONLY if you haven't pushed yet!)
git push -f origin main
```

⚠️ **WARNING**: Force push can lose others' work. Never do on shared branch!

---

**Pro Tips:**
- Always commit atomically (one feature = one commit)
- Write clear commit messages (future you will thank you)
- Pull before you push (avoid conflicts)
- Create pull requests for code review
- Test locally before pushing
- Keep main branch clean and stable
- Use feature branches for everything

🌊 Happy git!
