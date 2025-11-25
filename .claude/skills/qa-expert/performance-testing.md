# Skill: Performance Testing

**Category:** QA Expert  
**Priority:** Medium  
**Used By:** qa-automation agent

---

## Performance Metrics

- **Load Time:** < 3s
- **Time to Interactive:** < 5s
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

---

## Tools

- **Lighthouse:** Web performance
- **k6:** Load testing
- **React DevTools Profiler:** Component performance

---

## Load Testing Example

```javascript
// k6 load test
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 100, // 100 virtual users
  duration: '30s',
}

export default function () {
  const res = http.get('https://api.example.com/users')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  })
  sleep(1)
}
```

---

## Best Practices

### Do's ✅
- ✅ Test with realistic data volumes
- ✅ Monitor backend performance
- ✅ Test on various devices
- ✅ Set performance budgets

### Don'ts ❌
- ❌ Test only on fast networks
- ❌ Ignore memory leaks
- ❌ Skip mobile testing

---

**Used by qa-automation agent for performance validation.**

