# Phase 1: Requirements Analysis — JWT Authentication API

**Workflow:** jwt-auth-0324 | **Agent:** architect | **Complexity:** Deep

---

## Task Understanding

Build a JWT-based authentication system for a Node.js Express API with:
- User registration and login
- Access token + refresh token flow
- Password hashing with bcrypt
- Token rotation on refresh
- Rate limiting on auth endpoints

## Requirements

```toon
requirements[5]{id,requirement,priority}:
  R1,POST /auth/register — email + password → user + tokens,MUST
  R2,POST /auth/login — credentials → access + refresh tokens,MUST
  R3,POST /auth/refresh — refresh token → new token pair,MUST
  R4,POST /auth/logout — invalidate refresh token,MUST
  R5,Rate limit: 5 attempts/min on login and register,SHOULD
```

## Technical Design

```toon
design[4]{component,technology,rationale}:
  Passwords,bcrypt (12 rounds),Industry standard + timing-safe
  Access tokens,JWT (RS256 15min),Short-lived + asymmetric signing
  Refresh tokens,Opaque UUID in DB (7d),Revocable + not self-contained
  Rate limiting,express-rate-limit + Redis,Distributed + persistent
```

## Risks

```toon
risks[3]{risk,severity,mitigation}:
  Token theft via XSS,HIGH,HttpOnly cookies + CSP headers
  Brute force login,MEDIUM,Rate limiting + account lockout after 10 failures
  Refresh token reuse,HIGH,Token rotation + family detection (revoke all on reuse)
```

## Success Criteria

- [ ] All 5 endpoints functional
- [ ] 15+ tests covering happy path + edge cases
- [ ] bcrypt for passwords (not MD5/SHA)
- [ ] Refresh token rotation implemented
- [ ] Rate limiting active on auth routes

---

**Decision:** ✅ Approved → Proceeding to Phase 2
