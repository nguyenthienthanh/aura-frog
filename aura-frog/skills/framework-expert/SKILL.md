---
name: framework-expert
description: "Unified framework expertise bundle. Lazy-loads relevant framework patterns (React, Vue, Angular, Next.js, Node.js, Python, Laravel, Go, Flutter, Godot) based on detected tech stack."
autoInvoke: true
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

Lazy-loads only detected framework patterns (~500 tokens vs ~6000 for all skills).

## Bundles

```toon
bundles[5]{bundle,frameworks,detect_by}:
  web-frontend,"react vue angular nextjs svelte","package.json deps + file extensions"
  web-backend,"nodejs python laravel go","package.json/requirements.txt/composer.json/go.mod"
  mobile,"react-native flutter","app.json (expo) or pubspec.yaml"
  game,godot,"project.godot or *.gd files"
  typescript,typescript,"tsconfig.json or .ts files"
```

## Loading Strategy

Use cached detection from `.claude/project-contexts/[project]/project-detection.json`.
Load: core patterns always (~200 tokens) + detected framework (~300 tokens) + secondary if full-stack (~200 tokens).

---

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

---

## Framework Patterns (Load on Detection)

### React
```toon
react[6]{pattern,rule}:
  Components,Functional with hooks (no class)
  State,"useState local, useReducer complex"
  Effects,Cleanup + dependency arrays
  Memoization,useMemo/useCallback for expensive ops
  Context,Cross-cutting concerns only
  Error boundaries,Wrap critical UI sections
```

### Vue
```toon
vue[6]{pattern,rule}:
  Composition API,setup() with ref/reactive
  Composables,Extract reusable logic to use* functions
  Props,Types + validators
  Events,emit() for parent communication
  Stores,Pinia for global state
  Slots,Named slots for flexibility
```

### Angular
```toon
angular[6]{pattern,rule}:
  Components,Standalone preferred
  Services,Injectable providedIn root
  RxJS,Operators + async pipe
  Signals,Modern reactivity (v17+)
  Modules,Lazy loaded features
  Forms,Reactive with validators
```

### Next.js
```toon
nextjs[6]{pattern,rule}:
  App Router,Server components default
  Data fetching,fetch() in server components
  API routes,Route handlers in app/api/
  Middleware,Edge runtime for auth/redirects
  Caching,revalidate + cache tags
  Metadata,generateMetadata for SEO
```

### Node.js
```toon
nodejs[6]{pattern,rule}:
  Structure,Controllers + services + repos
  Async,async/await (no callbacks)
  Validation,Zod or Joi schemas
  Error handling,Custom error classes
  Middleware,Auth + logging + rate limit
  Database,ORM (Prisma/TypeORM) or query builder
```

### Python
```toon
python[6]{pattern,rule}:
  Type hints,All function signatures
  Async,asyncio for I/O bound
  Validation,Pydantic models
  Structure,Domain-driven design
  Testing,pytest with fixtures
  Dependencies,Virtual env + requirements
```

### Laravel
```toon
laravel[6]{pattern,rule}:
  Controllers,Single responsibility
  Models,Eloquent with scopes
  Validation,Form requests
  Services,Business logic extraction
  Events,Decouple with event/listener
  Queues,Background processing
```

### Go
```toon
go[6]{pattern,rule}:
  Structure,cmd/ internal/ pkg/
  Error handling,Explicit error returns
  Interfaces,Accept interfaces return structs
  Concurrency,Goroutines + channels
  Testing,Table-driven tests
  Dependencies,Go modules
```

### React Native
```toon
rn[6]{pattern,rule}:
  Navigation,React Navigation v6+
  Styling,StyleSheet or NativeWind
  State,Zustand or Redux Toolkit
  Platform,Platform.select() for differences
  Performance,FlatList + memo
  Testing,Detox for e2e
```

### Flutter
```toon
flutter[6]{pattern,rule}:
  Widgets,Composition over inheritance
  State,Riverpod or BLoC
  Navigation,go_router
  Styling,Theme extensions
  Testing,Widget + integration
  Platform,Platform channels for native
```

### Godot
```toon
godot[6]{pattern,rule}:
  Scenes,Composition with child scenes
  Scripts,GDScript with static typing
  Signals,Decouple with custom signals
  Resources,Custom resource classes
  Autoload,Singletons for global state
  Export,Multi-platform builds
```
