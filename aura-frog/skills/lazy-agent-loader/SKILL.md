---
name: lazy-agent-loader
description: "Load agent definitions on-demand to reduce context usage. Only loads full agent when needed."
autoInvoke: false
priority: high
triggers:
  - "when agent is selected"
  - "agent:load"
allowed-tools: Read, Glob
---

# Lazy Agent Loader

Reduce token usage: load agent summaries initially (~50 tokens each), full definition only when activated.

---

## Agent Index

```toon
agent_index[16]{id,category,specialty,keywords}:
  mobile,dev,React Native/Expo mobile,react-native/expo/RN/mobile/ios/android
  mobile-flutter,dev,Flutter/Dart mobile,flutter/dart/bloc/mobile
  web-angular,dev,Angular frontend,angular/ngrx/rxjs/typescript
  web-vuejs,dev,Vue.js frontend,vue/vuejs/pinia/nuxt/composition
  web-reactjs,dev,React frontend,react/reactjs/jsx/hooks/redux
  web-nextjs,dev,Next.js fullstack,next/nextjs/ssr/ssg/app-router
  architect,dev,Node.js backend,nodejs/express/nestjs/fastify/api
  backend-python,dev,Python backend,python/django/fastapi/flask/api
  backend-go,dev,Go backend,go/golang/gin/fiber/api
  backend-laravel,dev,Laravel/PHP backend,laravel/php/eloquent/artisan
  security,quality,Security auditing,security/vulnerability/audit/owasp
  tester,quality,Testing/QA,test/testing/coverage/qa/jest/cypress
  devops,ops,DevOps/CI-CD,deploy/docker/kubernetes/ci-cd/pipeline
  router,infra,Agent detection,detect/agent/select/route
  lead,infra,PM/orchestration,pm/project/orchestrate/manage
  scanner,infra,Project management,project/detect/identify/config/context
```

---

## Loading Strategy

| Score | Level | Action |
|-------|-------|--------|
| >= 80 | PRIMARY | Load full definition (`agents/[id].md`) |
| 50-79 | SECONDARY | Summary only from index |
| < 50 | OPTIONAL | Don't load |

---

## Token Savings

```toon
comparison[4]{scenario,without_lazy,with_lazy,savings}:
  Initial load,~48000,~1200,97.5%
  Single agent,~48000,~2700,94.4%
  Dual agent,~48000,~4200,91.3%
  3 agents,~48000,~5700,88.1%
```

---

## Cache

Loaded agents cached in session. Track: `loaded_agents[]: mobile,tester`. Force reload: `reload agent <id>`.

---

## Integration

Used automatically by `agent-detector` for optimized loading. Score agents by keywords from index, load only PRIMARY agents.

---
