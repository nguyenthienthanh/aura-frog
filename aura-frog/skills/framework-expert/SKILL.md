---
name: framework-expert
description: "Unified framework expertise bundle. Lazy-loads relevant framework patterns (React, Vue, Angular, Next.js, Node.js, Python, Laravel, Go, Flutter, Godot) based on detected tech stack."
autoInvoke: false
priority: 50
triggers:
  - "framework"
  - "react"
  - "vue"
  - "angular"
  - "nextjs"
  - "nodejs"
  - "python"
  - "laravel"
  - "go"
  - "flutter"
context: fork
---

# Framework Expert (Bundle)

Lazy-loads detected framework patterns. Use individual expert skills or Context7 for deep reference.

## Detection

```toon
bundles[5]{bundle,frameworks,detect_by}:
  web-frontend,"react vue angular nextjs svelte","package.json deps"
  web-backend,"nodejs python laravel go","package.json/requirements.txt/composer.json/go.mod"
  mobile,"react-native flutter","app.json (expo) or pubspec.yaml"
  game,godot,"project.godot or *.gd files"
  typescript,typescript,"tsconfig.json or .ts files"
```

## Core Patterns (All Frameworks)

```toon
core[8]{pattern,rule}:
  File organization,Group by feature not type
  Naming,PascalCase components camelCase functions
  Error handling,Graceful degradation + user feedback
  State,Minimize global state
  API design,RESTful or GraphQL conventions
  Testing,Unit + integration + e2e
  Performance,Lazy loading + code splitting
  Security,Input validation + sanitization
```

Load framework-specific patterns from individual expert skills on demand.
