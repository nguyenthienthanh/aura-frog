# Command: logs:analyze

**Command:** `logs:analyze [timeframe]`
**Agent:** devops-cicd
**Version:** 5.0.0

---

## 🎯 Purpose

Analyze application logs for patterns, anomalies, performance issues, and security threats using log aggregation platforms (ELK, CloudWatch, Datadog).

---

## 📋 Usage

```bash
# Analyze logs from last hour
logs:analyze

# Analyze last 24 hours
logs:analyze 24h

# Filter by log level
logs:analyze --level error,warn

# Filter by service
logs:analyze --service api-server

# Search for specific text
logs:analyze --search "payment failed"

# Detect anomalies
logs:analyze --detect-anomalies

# Export report
logs:analyze --export logs-report.md
```

---

## 🔧 Log Sources

### 1. CloudWatch Logs Insights
```sql
-- Query syntax
fields @timestamp, @message, level, service
| filter level = "ERROR"
| stats count() by service
| sort count desc
```

### 2. Elasticsearch (ELK)
```json
{
  "query": {
    "bool": {
      "must": [
        { "range": { "@timestamp": { "gte": "now-1h" } } },
        { "match": { "level": "ERROR" } }
      ]
    }
  },
  "aggs": {
    "errors_by_service": {
      "terms": { "field": "service.keyword" }
    }
  }
}
```

### 3. Datadog Logs
```
service:api-server status:error @timestamp:[now-1h TO now]
| stats count() by @message
```

---

## 📊 Output

```markdown
# Log Analysis Report

**Timeframe:** Last 24 hours (2025-11-25 23:00 - 2025-11-26 23:00)
**Total Logs:** 2,450,000
**Services Analyzed:** 5

---

## Summary

| Metric | Value | Change |
|--------|-------|--------|
| Total Logs | 2.45M | ↑ +12% |
| Error Logs | 3,245 | ↑ +28% |
| Warning Logs | 12,580 | ↑ +8% |
| Info Logs | 2,434,175 | ↑ +11% |
| Avg Log Rate | 1,021/sec | ↑ +12% |

---

## 📈 Log Volume by Service

| Service | Total | Error | Warn | Info |
|---------|-------|-------|------|------|
| api-server | 1.2M | 1,850 | 6,200 | 1.19M |
| worker-service | 650K | 980 | 3,100 | 646K |
| auth-service | 400K | 280 | 2,150 | 398K |
| notification-service | 150K | 95 | 890 | 149K |
| scheduler-service | 50K | 40 | 240 | 50K |

---

## 🔴 Top Errors (20)

### 1. Database Connection Timeout
**Count:** 1,245 occurrences
**First Seen:** 14:30:00
**Last Seen:** 22:45:00
**Service:** api-server

**Sample Log:**
```json
{
  "@timestamp": "2025-11-26T14:30:12.456Z",
  "level": "ERROR",
  "service": "api-server",
  "message": "Database connection timeout after 5000ms",
  "context": {
    "query": "SELECT * FROM users WHERE id = $1",
    "params": ["user-12345"],
    "duration": 5012,
    "pool": { "idle": 0, "total": 10, "waiting": 25 }
  },
  "stack": "Error: timeout\n  at Client.query (/app/db.js:45:12)"
}
```

**Pattern:** Spikes during 14:00-16:00 (peak traffic)
**Root Cause:** Connection pool exhausted

---

### 2. Payment API Timeout
**Count:** 420 occurrences
**Service:** api-server
**Impact:** $8,400 in failed transactions

**Sample Log:**
```json
{
  "@timestamp": "2025-11-26T18:45:33.789Z",
  "level": "ERROR",
  "service": "api-server",
  "message": "Payment gateway timeout",
  "context": {
    "orderId": "order-789",
    "amount": 199.99,
    "currency": "USD",
    "gateway": "stripe",
    "duration": 30012,
    "userId": "user-456"
  }
}
```

---

### 3. Image Upload Failed
**Count:** 280 occurrences
**Service:** api-server

**Reasons:**
- File size exceeded (180 logs)
- Invalid file type (65 logs)
- S3 upload failed (35 logs)

---

## 🟡 Top Warnings (10)

### 1. Slow Database Query
**Count:** 3,850 occurrences
**Threshold:** >1000ms

**Sample Log:**
```json
{
  "@timestamp": "2025-11-26T15:20:45.123Z",
  "level": "WARN",
  "service": "api-server",
  "message": "Slow query detected",
  "context": {
    "query": "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    "duration": 2450,
    "rows": 1200
  }
}
```

**Pattern:** Consistent throughout day
**Action:** Add index on orders(user_id, created_at)

---

### 2. High Memory Usage
**Count:** 1,200 occurrences
**Threshold:** >85%

**Service:** worker-service
**Peak:** 92% at 16:30
**Action:** Investigate memory leaks

---

## 📊 Performance Metrics

### Response Time Distribution
```
Range       | Count   | %
------------|---------|------
< 100ms     | 2.1M    | 86%   ✅
100-500ms   | 280K    | 11%   🟡
500ms-1s    | 45K     | 2%    🟠
1s-5s       | 18K     | 0.7%  🔴
> 5s        | 7K      | 0.3%  🔴
```

**P50:** 45ms
**P95:** 280ms
**P99:** 1.2s
**Max:** 8.5s

---

### Slowest Endpoints (P99)

| Endpoint | P99 | Count | Status |
|----------|-----|-------|--------|
| POST /api/reports/generate | 8.5s | 120 | 🔴 |
| GET /api/orders/:id/details | 3.2s | 1,850 | 🟠 |
| POST /api/images/upload | 2.1s | 680 | 🟠 |
| GET /api/users/:id/history | 1.8s | 3,200 | 🟡 |

---

## 🔍 Pattern Detection

### 1. Traffic Spike Detected
**Time:** 14:00 - 16:00
**Magnitude:** 3x normal traffic
**Impact:** Increased errors (DB timeouts)

**Logs During Spike:**
- Normal: 400 logs/sec
- Peak: 1,200 logs/sec (+200%)
- Error rate: 0.12% → 0.45% (+275%)

---

### 2. Retry Storm Detected
**Service:** worker-service
**Time:** 19:00 - 19:30
**Pattern:** Exponential retry attempts

```
19:00:01 - Job failed, retry 1/5
19:00:03 - Job failed, retry 2/5
19:00:07 - Job failed, retry 3/5
19:00:15 - Job failed, retry 4/5
19:00:31 - Job failed, retry 5/5
19:00:32 - Job failed, retry 1/5  (new cycle)
```

**Root Cause:** Downstream service outage
**Action:** Implement exponential backoff with jitter

---

### 3. Suspicious Login Pattern
**Time:** 02:00 - 04:00
**Pattern:** Failed login attempts from single IP

```
IP: 203.0.113.50
Failed attempts: 1,250
Usernames tried: 450 different
Success rate: 0%
```

**Threat:** Potential brute force attack
**Action:** Block IP, implement rate limiting

---

## 🚨 Anomaly Detection

### Database Query Time Anomaly
**Detected:** 14:30
**Normal:** 50ms average
**Anomaly:** 2,500ms average (50x increase)
**Duration:** 2 hours
**Status:** ✅ Resolved at 16:30

**Timeline:**
```
14:00 ━━━━━━━━━━━━ 50ms  (normal)
14:30 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2,500ms  ⚠️ SPIKE
15:00 ━━━━━━━━━━━━━━━━━━━━━━ 1,800ms
15:30 ━━━━━━━━━━━━━━━━ 900ms
16:00 ━━━━━━━━━━━━━━ 400ms
16:30 ━━━━━━━━━━━━ 60ms  ✅ back to normal
```

---

## 📊 User Activity

### Most Active Users (by logs)
| User ID | Requests | Errors |
|---------|----------|--------|
| user-12345 | 8,450 | 42 |
| user-67890 | 6,200 | 18 |
| user-11111 | 5,100 | 9 |

### Most Error-Prone Users
| User ID | Requests | Error Rate |
|---------|----------|------------|
| user-99999 | 250 | 48% 🔴 |
| user-88888 | 680 | 22% 🟠 |
| user-77777 | 1,200 | 8% 🟡 |

**Recommendation:** Investigate user-99999 (possible bot or misconfigured client)

---

## 🔐 Security Events

### Failed Authentication Attempts
**Count:** 3,450
**Unique IPs:** 280
**Success Rate:** 12%

**Top Failed IPs:**
- 203.0.113.50: 1,250 attempts (brute force)
- 198.51.100.42: 850 attempts
- 192.0.2.10: 420 attempts

**Action:**
- Block suspicious IPs
- Implement CAPTCHA after 3 failed attempts
- Alert security team

---

### Unusual API Access Patterns
**Pattern:** Sequential user ID enumeration
```
GET /api/users/1
GET /api/users/2
GET /api/users/3
... (10,000 requests in 5 minutes)
```

**IP:** 203.0.113.75
**Action:** Block IP, implement API rate limiting

---

## 📈 Trends

### Error Rate Trend (7 days)
```
Day     | Errors | Change
--------|--------|--------
Nov 20  | 2,100  | baseline
Nov 21  | 2,250  | ↑ +7%
Nov 22  | 2,180  | ↓ -3%
Nov 23  | 2,400  | ↑ +10%
Nov 24  | 2,650  | ↑ +10%
Nov 25  | 2,980  | ↑ +12%
Nov 26  | 3,245  | ↑ +9%  ⚠️ Trending up
```

**Insight:** Error rate increasing 9%/day on average
**Action:** Investigate root causes before errors escalate

---

## 🎯 Recommendations

### Immediate (Next 2 hours)
1. ✅ Scale database connection pool
2. ✅ Block suspicious IPs (brute force)
3. ✅ Investigate user-99999 activity

### Short-term (This week)
4. Add index on orders(user_id, created_at)
5. Implement API rate limiting (100 req/min per IP)
6. Add CAPTCHA for failed login attempts
7. Optimize slow report generation endpoint

### Long-term (Next sprint)
8. Implement distributed tracing
9. Set up log-based alerting
10. Create automated anomaly detection
11. Implement circuit breakers for external APIs

---

## 📊 Log Quality Metrics

**Structured Logs:** 95% (✅ Good)
**Missing Context:** 5% (🟡 Needs improvement)
**Log Levels Used Correctly:** 92% (✅ Good)

**Recommendations:**
- Add context to 5% of logs missing user/request IDs
- Standardize log format across all services

---

## 🔄 Next Analysis

**Scheduled:** 2025-11-27 23:00 (daily)
**Subscribe:** #logs-analysis Slack channel
```

---

## 🎨 Query Patterns

### Find All Errors for User
```bash
logs:analyze --user user-12345 --level error
```

### Find Slow Queries
```bash
logs:analyze --search "Slow query" --threshold 1000ms
```

### Detect Failed Payments
```bash
logs:analyze --search "payment" --level error
```

### Find Security Events
```bash
logs:analyze --search "authentication failed|unauthorized|forbidden"
```

---

**Command:** logs:analyze
**Version:** 5.0.0
