# CI/CD Integration

**Version:** 1.0.0

---

## Overview

Visual pixel-perfect tests can be integrated into CI/CD pipelines. The test runner exits with code 1 on failure, making it compatible with all CI systems.

---

## Exit Codes

```toon
exit_codes[3]{code,meaning,action}:
  0,All tests passed,Continue pipeline
  1,One or more tests failed,Fail pipeline
  2,Error (missing deps etc),Fail pipeline
```

---

## GitHub Actions

```yaml
name: Visual Tests

on:
  pull_request:
    paths:
      - 'src/components/**'
      - '.claude/visual/**'

jobs:
  visual-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Install Visual Test Dependencies
        run: npm install puppeteer pngjs pixelmatch

      - name: Start Dev Server
        run: npm run dev &
        env:
          CI: true

      - name: Wait for Server
        run: npx wait-on http://localhost:3000 -t 30000

      - name: Run Visual Tests
        run: ./scripts/visual/visual-test.sh --ci

      - name: Upload Diff Artifacts
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-diff
          path: .claude/visual/snapshots/diff/
          retention-days: 7

      - name: Upload Current Snapshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-current
          path: .claude/visual/snapshots/current/
          retention-days: 7
```

---

## GitLab CI

```yaml
visual-test:
  stage: test
  image: node:20

  before_script:
    - npm ci
    - npm install puppeteer pngjs pixelmatch
    - apt-get update && apt-get install -y libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2

  script:
    - npm run dev &
    - npx wait-on http://localhost:3000 -t 30000
    - ./scripts/visual/visual-test.sh --ci

  artifacts:
    when: on_failure
    paths:
      - .claude/visual/snapshots/diff/
      - .claude/visual/snapshots/current/
    expire_in: 1 week

  rules:
    - changes:
        - src/components/**/*
        - .claude/visual/**/*
```

---

## CircleCI

```yaml
version: 2.1

jobs:
  visual-test:
    docker:
      - image: cimg/node:20.0-browsers

    steps:
      - checkout

      - restore_cache:
          keys:
            - npm-deps-{{ checksum "package-lock.json" }}

      - run:
          name: Install Dependencies
          command: npm ci

      - run:
          name: Install Visual Test Deps
          command: npm install puppeteer pngjs pixelmatch

      - save_cache:
          key: npm-deps-{{ checksum "package-lock.json" }}
          paths:
            - node_modules

      - run:
          name: Start Dev Server
          command: npm run dev
          background: true

      - run:
          name: Wait for Server
          command: npx wait-on http://localhost:3000 -t 30000

      - run:
          name: Run Visual Tests
          command: ./scripts/visual/visual-test.sh --ci

      - store_artifacts:
          path: .claude/visual/snapshots/diff
          destination: visual-diff
          when: on_fail

workflows:
  test:
    jobs:
      - visual-test
```

---

## Baseline Management

### Git LFS for Large Baselines

```bash
# Track baseline images with Git LFS
git lfs track ".claude/visual/snapshots/baseline/*.png"
git add .gitattributes
git commit -m "Track visual baselines with LFS"
```

### Updating Baselines

```bash
# Local: Update all baselines
./scripts/visual/visual-test.sh --update-baseline

# Commit updated baselines
git add .claude/visual/snapshots/baseline/
git commit -m "Update visual baselines"
```

### PR Workflow

1. Developer makes UI changes
2. Visual tests fail (expected)
3. Developer reviews diff images
4. If changes are intentional:
   - Run `--update-baseline` locally
   - Commit new baselines
   - Push to PR
5. Reviewer approves baseline changes

---

## Docker Support

### Dockerfile for Visual Tests

```dockerfile
FROM node:20-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm install puppeteer pngjs pixelmatch

COPY . .

CMD ["./scripts/visual/visual-test.sh", "--ci"]
```

---

## Parallel Testing

For large test suites, run specs in parallel:

```yaml
# GitHub Actions matrix strategy
jobs:
  visual-test:
    strategy:
      matrix:
        spec: [header, sidebar, login, dashboard]

    steps:
      # ... setup steps ...

      - name: Run Visual Test - ${{ matrix.spec }}
        run: ./scripts/visual/visual-test.sh --spec=${{ matrix.spec }} --ci
```

---

## Notifications

### Slack on Failure

```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    payload: |
      {
        "text": "Visual tests failed on ${{ github.ref }}",
        "attachments": [
          {
            "color": "danger",
            "fields": [
              {"title": "Repository", "value": "${{ github.repository }}", "short": true},
              {"title": "Branch", "value": "${{ github.ref_name }}", "short": true}
            ]
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Best Practices

```toon
ci_best_practices[6]{practice,reason}:
  Run on relevant paths only,Avoid running on docs/config changes
  Use artifacts on failure,Debug diff images easily
  Set reasonable timeouts,Prevent hanging jobs
  Use Git LFS for baselines,Keep repo size manageable
  Run in headless mode,Required for CI environments
  Cache node_modules,Speed up subsequent runs
```

---

**Version:** 1.0.0 | **Last Updated:** 2026-01-14
