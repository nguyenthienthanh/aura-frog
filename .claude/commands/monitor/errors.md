# Command: monitor:errors

**Command:** `monitor:errors [timeframe]`
**Agent:** devops-cicd
**Version:** 5.0.0

---

## 🎯 Purpose

Query and analyze application errors from monitoring platforms (Sentry, CloudWatch, New Relic) with filtering, grouping, and trend analysis.

---

## 📋 Usage

```bash
# Errors in last hour
monitor:errors

# Errors in last 24 hours
monitor:errors 24h

# Errors in last 7 days
monitor:errors 7d

# Filter by environment
monitor:errors --env production

# Filter by severity
monitor:errors --severity error,critical

# Group by error type
monitor:errors --group-by type

# Export report
monitor:errors --export errors-report.json
```

---

## 🔧 Query Sources

### 1. Sentry API
```bash
# Query Sentry issues
curl -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  "https://sentry.io/api/0/projects/my-org/my-project/issues/?query=is:unresolved"
```

### 2. CloudWatch Logs Insights
```bash
# Query CloudWatch logs
aws logs start-query \
  --log-group-name /aws/lambda/my-api \
  --start-time $(date -d '1 hour ago' +%s) \
  --end-time $(date +%s) \
  --query-string 'fields @timestamp, @message
    | filter @message like /ERROR/
    | stats count() by @message'
```

### 3. New Relic NRQL
```bash
# Query New Relic errors
curl -H "X-Query-Key: $NEW_RELIC_QUERY_KEY" \
  "https://insights-api.newrelic.com/v1/accounts/$ACCOUNT_ID/query?nrql=
    SELECT count(*) FROM TransactionError
    WHERE appName = 'my-app'
    SINCE 1 hour ago
    FACET error.message"
```

---

## 📊 Output

```markdown
# Error Monitoring Report

**Timeframe:** Last 24 hours
**Environment:** production
**Total Errors:** 127 (+15% vs previous period)

---

## Summary

| Severity | Count | % Total | Trend |
|----------|-------|---------|-------|
| Critical | 3 | 2.4% | ↑ +200% |
| Error | 45 | 35.4% | ↑ +22% |
| Warning | 79 | 62.2% | ↓ -5% |

**Status:**
- 🔴 3 critical errors (requires immediate attention)
- 🟠 12 new error types (appeared in last 24h)
- 🟡 89 affected users

---

## 🔴 Critical Errors (3)

### 1. Database Connection Timeout
**First Seen:** 2025-11-26 14:30:00
**Last Seen:** 2025-11-26 22:15:00
**Count:** 45 occurrences
**Affected Users:** 32

**Error Message:**
```
Error: connect ETIMEDOUT 10.0.1.50:5432
  at Socket.<anonymous> (/node_modules/pg/lib/client.js:245:12)
  at Object.onceWrapper (node:events:632:28)
```

**Stack Trace:**
```
src/services/database.ts:56:12
src/repositories/user.repository.ts:89:20
src/controllers/auth.controller.ts:145:18
```

**Context:**
- Endpoint: POST /api/auth/login
- User Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)
- IP: 203.0.113.42
- Environment: production
- Server: api-server-3

**Trend:** ↑ Started 8 hours ago, increasing

**Root Cause Hypothesis:**
- Database server overloaded (CPU 95%)
- Connection pool exhausted
- Network latency spike

**Recommended Actions:**
1. Scale database read replicas
2. Increase connection pool size
3. Add connection retry logic
4. Set up database monitoring alerts

---

### 2. Payment Gateway API Failure
**First Seen:** 2025-11-26 18:45:00
**Count:** 18 occurrences
**Affected Users:** 18 (100% conversion loss)

**Error Message:**
```
PaymentGatewayError: Gateway timeout - no response after 30s
```

**Financial Impact:** $2,340 in lost transactions

**Actions:**
1. Contact payment provider
2. Implement circuit breaker
3. Add fallback payment method

---

### 3. Memory Leak in Image Processing
**First Seen:** 2025-11-26 12:00:00
**Count:** 8 server crashes
**Affected Users:** All users (service downtime)

**Error Message:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Memory Usage:**
- Normal: 200 MB
- Before crash: 1.8 GB

**Actions:**
1. Review image processing code
2. Implement streaming for large files
3. Increase Node.js heap size (temporary)
4. Add memory monitoring

---

## 🟠 High Priority Errors (12)

### Validation Error: Invalid Email Format
**Count:** 25
**Trend:** ↑ +50%
**Cause:** Client-side validation bypass
**Fix:** Add server-side email regex validation

### API Rate Limit Exceeded
**Count:** 19
**Trend:** ↑ +100%
**Cause:** Bot traffic
**Fix:** Implement IP-based rate limiting

---

## 🟡 Medium Priority Errors (30)

### File Upload Failed: Size Limit Exceeded
**Count:** 15
**Fix:** Better client-side file size validation

### Session Expired
**Count:** 12
**Note:** Expected behavior, user notification needed

---

## 📈 Error Trends

### Errors Over Time (24h)
```
Hour | Errors
-----|--------
00:00| ███░░░░░░░ 12
01:00| ██░░░░░░░░  8
02:00| █░░░░░░░░░  5
...
14:00| ███████░░░ 28  ⚠️ Spike (DB timeout started)
15:00| ████████░░ 32
16:00| █████████░ 35
...
22:00| ██████░░░░ 24
```

**Pattern:** Error spike at 14:00 correlates with traffic increase (3x normal)

---

## 🎯 Error Distribution

### By Endpoint
| Endpoint | Errors | % Total |
|----------|--------|---------|
| POST /api/auth/login | 45 | 35% |
| POST /api/orders | 18 | 14% |
| GET /api/users/:id | 15 | 12% |
| POST /api/images/upload | 12 | 9% |
| Others | 37 | 30% |

### By Error Type
| Type | Count | % |
|------|-------|---|
| DatabaseError | 45 | 35% |
| ValidationError | 32 | 25% |
| TimeoutError | 25 | 20% |
| AuthenticationError | 18 | 14% |
| Others | 7 | 6% |

### By User Impact
| Impact | Count |
|--------|-------|
| 1-10 users | 52 errors |
| 11-50 users | 8 errors |
| 51+ users | 3 errors |

---

## 🔍 Top Affected Users

| User ID | Errors | Last Error |
|---------|--------|------------|
| user-12345 | 12 | DB timeout (2h ago) |
| user-67890 | 8 | Payment failed (4h ago) |
| user-11111 | 6 | Upload failed (1h ago) |

---

## 🚨 Alerts Triggered

✅ **Slack:** #alerts (3 critical errors)
✅ **PagerDuty:** On-call engineer notified (DB timeout)
✅ **Email:** Engineering team (daily summary)

---

## 📝 Recommended Actions

### Immediate (Next 2 hours)
1. ✅ Scale database read replicas (ops team)
2. ✅ Increase connection pool: 10 → 50
3. ✅ Contact payment gateway support
4. ✅ Deploy hotfix: Add connection retry logic

### Short-term (This week)
5. Implement circuit breaker for payment API
6. Add memory monitoring to image processing
7. Review and optimize slow database queries
8. Implement better client-side validation

### Long-term (Next sprint)
9. Migrate to database connection pooler (PgBouncer)
10. Implement comprehensive error recovery
11. Add automated error classification
12. Set up error budget tracking

---

## 📊 Error Budget

**Monthly Error Budget:** 99.9% uptime = 43.2 min downtime
**Used This Month:** 28 minutes (65%)
**Remaining:** 15.2 minutes (35%)

**Status:** ⚠️ Warning - Approaching budget limit
```

---

## 🎨 Query Examples

### Filter by Severity
```bash
monitor:errors --severity critical
```

### Filter by Endpoint
```bash
monitor:errors --endpoint "/api/auth/*"
```

### Filter by User
```bash
monitor:errors --user user-12345
```

### Compare Timeframes
```bash
monitor:errors 24h --compare previous-24h
```

### Group by Environment
```bash
monitor:errors --group-by environment
```

---

## 🔧 Integration with JIRA

**Auto-create tickets for critical errors:**
```bash
monitor:errors --create-tickets --severity critical
```

**Output:**
```
✅ Created JIRA tickets:
- BUG-1234: Database Connection Timeout (45 occurrences)
- BUG-1235: Payment Gateway API Failure (18 occurrences)
- BUG-1236: Memory Leak in Image Processing (8 crashes)
```

---

**Command:** monitor:errors
**Version:** 5.0.0
