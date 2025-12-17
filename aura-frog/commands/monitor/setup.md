# Command: monitor:setup

**Purpose:** Setup application monitoring (errors, performance, logging)
**Agent:** devops-cicd

---

## Usage

```
monitor:setup              # Interactive platform selection
monitor:setup sentry       # Error tracking
monitor:setup newrelic     # Performance monitoring
monitor:setup datadog      # Full observability
monitor:setup --test       # Test configuration
```

---

## Platforms

```toon
platforms[5]{platform,type,package}:
  Sentry,Error tracking,@sentry/node
  New Relic,APM + performance,newrelic
  Datadog,Full observability,dd-trace
  CloudWatch,AWS logging,aws-sdk
  ELK,Log aggregation,winston + elasticsearch
```

---

## Setup Steps

```toon
steps[4]{step,action}:
  1. Install,Add packages + dependencies
  2. Configure,Create config files + env vars
  3. Instrument,Add to app entry point
  4. Test,Trigger test event + verify
```

---

## Environment Variables

```toon
env_vars[4]{platform,vars}:
  Sentry,SENTRY_DSN
  New Relic,NEW_RELIC_LICENSE_KEY + NEW_RELIC_APP_NAME
  Datadog,DD_API_KEY + DD_APP_KEY
  CloudWatch,AWS_REGION + AWS_ACCESS_KEY_ID
```

---

## Output

```
├── sentry.config.ts       # Sentry configuration
├── monitoring/
│   ├── index.ts           # Monitoring initialization
│   └── logger.ts          # Structured logging
└── .env.example           # Required env vars
```

---

## Best Practices

- Enable source maps for stack traces
- Configure sampling rates for high-traffic apps
- Set up alerts for critical errors
- Use structured logging (JSON format)

---

**Version:** 2.0.0
