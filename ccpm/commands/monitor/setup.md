# Command: monitor:setup

**Command:** `monitor:setup [platform]`
**Agent:** devops-cicd
**Version:** 5.2.0

---

## 🎯 Purpose

Setup application monitoring with error tracking (Sentry), performance monitoring (New Relic, Datadog), and logging infrastructure (ELK, CloudWatch).

---

## 📋 Usage

```bash
# Interactive setup (choose platform)
monitor:setup

# Setup specific platform
monitor:setup sentry
monitor:setup newrelic
monitor:setup datadog

# Setup multiple
monitor:setup sentry,cloudwatch

# Test configuration
monitor:setup --test
```

---

## 🔧 Monitoring Platforms

### 1. Sentry (Error Tracking)
```bash
# Install
npm install @sentry/node @sentry/tracing

# Configure
```

**sentry.config.ts:**
```typescript
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    new ProfilingIntegration(),
  ],
});

export default Sentry;
```

**Usage:**
```typescript
import Sentry from './sentry.config';

try {
  await processPayment(order);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'payment' },
    user: { id: user.id, email: user.email },
    extra: { orderId: order.id }
  });
  throw error;
}
```

---

### 2. New Relic (APM)
```bash
# Install
npm install newrelic

# Configure
```

**newrelic.js:**
```javascript
exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info'
  },
  distributed_tracing: {
    enabled: true
  },
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f'
  }
};
```

**Usage:**
```typescript
// Import first in main.ts
import 'newrelic';

// Custom instrumentation
const newrelic = require('newrelic');

newrelic.startWebTransaction('/api/users', async () => {
  const users = await fetchUsers();
  newrelic.addCustomAttribute('userCount', users.length);
  return users;
});
```

---

### 3. Datadog (Full Observability)
```bash
# Install
npm install dd-trace --save

# Configure
```

**datadog.config.ts:**
```typescript
import tracer from 'dd-trace';

tracer.init({
  service: process.env.DD_SERVICE,
  env: process.env.DD_ENV,
  version: process.env.DD_VERSION,
  logInjection: true,
  runtimeMetrics: true,
  profiling: true
});

export default tracer;
```

**Usage:**
```typescript
import tracer from './datadog.config';

// Trace specific function
const span = tracer.startSpan('database.query');
try {
  const result = await db.query(sql);
  span.setTag('rows', result.length);
  return result;
} finally {
  span.finish();
}
```

---

### 4. ELK Stack (Logging)
```bash
# Docker compose
```

**docker-compose.yml:**
```yaml
version: '3'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
```

**logstash.conf:**
```
input {
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  json {
    source => "message"
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }
}
```

---

### 5. AWS CloudWatch (AWS Apps)
```typescript
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

const cloudwatch = new CloudWatchClient({ region: 'us-east-1' });

// Log custom metric
await cloudwatch.send(new PutMetricDataCommand({
  Namespace: 'MyApp',
  MetricData: [{
    MetricName: 'OrderCount',
    Value: orderCount,
    Unit: 'Count',
    Timestamp: new Date()
  }]
}));
```

---

## 📊 Setup Output

```markdown
# Monitoring Setup Complete

**Date:** 2025-11-26
**Project:** my-project
**Environment:** production

---

## Platforms Configured

### ✅ Sentry (Error Tracking)
- **DSN:** https://xxx@o123.ingest.sentry.io/456
- **Environment:** production
- **Sample Rate:** 100%
- **Features:** Error tracking, Performance, Profiling

### ✅ New Relic (APM)
- **App Name:** my-project-api
- **License Key:** Configured (hidden)
- **Features:** APM, Distributed Tracing, Custom Events

### ✅ CloudWatch (AWS Logs)
- **Log Group:** /aws/lambda/my-project-api
- **Retention:** 7 days
- **Features:** Logs, Metrics, Alarms

---

## Environment Variables Added

Add to `.env`:
```bash
# Sentry
SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456
SENTRY_ENVIRONMENT=production

# New Relic
NEW_RELIC_LICENSE_KEY=your_key_here
NEW_RELIC_APP_NAME=my-project-api

# Datadog (if using)
DD_SERVICE=my-project-api
DD_ENV=production
DD_VERSION=1.0.0
DD_API_KEY=your_key_here
```

---

## Code Changes

**src/main.ts:**
```typescript
// Import monitoring first (before other imports)
import './config/sentry';
import 'newrelic';
import './config/datadog';

// Rest of app...
```

**src/middleware/error-handler.ts:**
```typescript
import Sentry from '../config/sentry';

export function errorHandler(err, req, res, next) {
  // Log to Sentry
  Sentry.captureException(err, {
    tags: { endpoint: req.path, method: req.method },
    user: req.user ? { id: req.user.id } : undefined
  });

  // Send response
  res.status(500).json({ error: 'Internal server error' });
}
```

---

## Dashboards

### Sentry Dashboard
**URL:** https://sentry.io/organizations/my-org/issues/
- Real-time error tracking
- Stack traces
- User impact

### New Relic Dashboard
**URL:** https://one.newrelic.com/
- Response times
- Throughput
- Error rates
- Database queries

### CloudWatch Dashboard
**URL:** https://console.aws.amazon.com/cloudwatch/
- Custom metrics
- Log insights
- Alarms

---

## Alerting Rules

### Sentry Alerts
- Error rate > 10/min → Slack #alerts
- New error type → Email team
- Performance degradation → PagerDuty

### New Relic Alerts
- Response time > 2s → Slack #alerts
- Error rate > 5% → PagerDuty
- Apdex < 0.8 → Email team

### CloudWatch Alarms
- Lambda errors > 10 → SNS
- API Gateway 5xx > 5% → SNS
- DynamoDB throttles → SNS

---

## Testing

**Test Sentry:**
```bash
curl -X POST http://localhost:3000/test-error
# Check Sentry dashboard for error
```

**Test New Relic:**
```bash
# Generate traffic
ab -n 1000 -c 10 http://localhost:3000/api/users
# Check New Relic APM dashboard
```

**Test CloudWatch:**
```bash
aws cloudwatch get-metric-statistics \
  --namespace MyApp \
  --metric-name OrderCount \
  --start-time 2025-11-26T00:00:00Z \
  --end-time 2025-11-26T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

---

## Next Steps

1. ✅ Configure alert recipients
2. ✅ Set up Slack integration
3. ✅ Create custom dashboards
4. ✅ Test error tracking (throw test error)
5. ✅ Review baseline metrics (first 24h)
6. ✅ Tune alert thresholds

**Documentation:** See `docs/monitoring-guide.md`
```

---

## 🎯 Best Practices

### 1. Structured Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

logger.info('User logged in', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});
```

### 2. Context-Rich Errors
```typescript
Sentry.captureException(error, {
  tags: { feature: 'checkout', step: 'payment' },
  user: { id: user.id, username: user.email },
  extra: {
    orderId: order.id,
    amount: order.total,
    paymentMethod: order.paymentMethod
  }
});
```

### 3. Performance Tracking
```typescript
const startTime = Date.now();
try {
  const result = await expensiveOperation();
  const duration = Date.now() - startTime;

  logger.info('Operation completed', {
    operation: 'expensiveOperation',
    duration,
    success: true
  });
} catch (error) {
  logger.error('Operation failed', {
    operation: 'expensiveOperation',
    duration: Date.now() - startTime,
    error: error.message
  });
}
```

---

**Command:** monitor:setup
**Version:** 5.2.0
