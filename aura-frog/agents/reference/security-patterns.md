# Security Agent - Full Reference Patterns

**Source Agent:** `agents/security.md`
**Load:** On-demand when deep security expertise needed

---

## Detailed OWASP Competencies

### Vulnerability Scanning
- Dependency scanning (npm audit, Snyk, OWASP Dependency-Check)
- Static code analysis (SonarQube, Semgrep, Bandit)
- Dynamic scanning (OWASP ZAP, Burp Suite)
- Container scanning (Trivy, Anchore)
- Secret scanning (GitGuardian, TruffleHog)

### Authentication & Authorization
- OAuth 2.0 / OpenID Connect implementation review
- JWT security (algorithm confusion, signature validation)
- Session management (secure cookies, CSRF tokens)
- Password policies (hashing, salting, bcrypt, argon2)
- Multi-factor authentication (MFA) implementation
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)

### Secure Coding Practices
- Input validation and sanitization
- Output encoding (prevent XSS)
- Parameterized queries (prevent SQL injection)
- Secure file uploads
- Content Security Policy (CSP)
- Security headers (Helmet.js, HSTS, X-Frame-Options)
- Rate limiting and throttling

### Cryptography
- Encryption at rest (AES-256, database encryption)
- Encryption in transit (TLS 1.3, HTTPS)
- Key management (KMS, Vault, env variables)
- Hashing (SHA-256, bcrypt, argon2)
- Digital signatures
- Certificate management

### API Security
- API authentication (API keys, OAuth, JWT)
- Rate limiting and quotas
- Input validation
- CORS configuration
- API versioning security
- GraphQL security (query depth limiting, cost analysis)

### Mobile Security
- Certificate pinning
- Secure storage (Keychain, Keystore)
- Code obfuscation
- Root/jailbreak detection
- Secure communication
- Biometric authentication

### Infrastructure Security
- Cloud security (AWS IAM, GCP IAM, Azure RBAC)
- Network security (firewalls, security groups)
- Container security (Docker, Kubernetes)
- Secrets management (AWS Secrets Manager, HashiCorp Vault)
- Environment separation

### Security Testing
- Penetration testing basics
- Threat modeling (STRIDE, DREAD)
- Security test cases
- Fuzzing
- Security regression testing

### Compliance & Standards
- GDPR compliance
- HIPAA compliance
- PCI DSS compliance
- SOC 2 Type II
- ISO 27001
- NIST Cybersecurity Framework

---

## Tech Stack Expertise

### Security Tools

**Dependency Scanning:**
- npm audit (Node.js)
- Snyk (multi-language)
- OWASP Dependency-Check
- pip-audit (Python)
- bundler-audit (Ruby)
- Go vulnerability scanner

**Static Application Security Testing (SAST):**
- SonarQube / SonarCloud
- Semgrep
- ESLint security plugins
- Bandit (Python)
- Brakeman (Ruby on Rails)
- gosec (Go)

**Dynamic Application Security Testing (DAST):**
- OWASP ZAP
- Burp Suite Community/Pro
- Nikto
- SQLMap

**Secret Scanning:**
- GitGuardian
- TruffleHog
- git-secrets
- detect-secrets

**Container Security:**
- Trivy
- Anchore
- Clair
- Docker Bench Security

### Security Libraries

**Node.js:**
- helmet (security headers)
- express-rate-limit
- express-validator
- joi / zod (validation)
- bcrypt / argon2
- jsonwebtoken
- passport

**Python:**
- django-security
- Flask-Security
- cryptography
- PyJWT
- passlib

**PHP:**
- Laravel security features
- password_hash / password_verify
- CSRF protection

**React Native:**
- react-native-keychain
- react-native-ssl-pinning
- react-native-biometrics

### Cloud Security

**AWS:**
- AWS IAM, AWS Secrets Manager, AWS WAF
- AWS Shield, AWS GuardDuty, AWS Security Hub

**GCP:**
- GCP IAM, Secret Manager
- Cloud Armor, Security Command Center

**Azure:**
- Azure AD, Key Vault
- Azure Security Center, Azure Sentinel

---

## Security Checklists

### Web Application Security Checklist

**Authentication:**
- [ ] Passwords hashed with bcrypt/argon2 (cost factor >= 12)
- [ ] Account lockout after N failed attempts
- [ ] MFA available for sensitive operations
- [ ] Secure password reset flow (tokens expire, one-time use)
- [ ] Session timeout configured (< 30 min idle)
- [ ] CSRF tokens on all state-changing operations
- [ ] Secure cookie flags (HttpOnly, Secure, SameSite)

**Authorization:**
- [ ] Principle of least privilege enforced
- [ ] All routes/endpoints have access control
- [ ] Horizontal privilege escalation prevented
- [ ] Vertical privilege escalation prevented
- [ ] Direct object references are authorized

**Input Validation:**
- [ ] All user inputs validated (client + server)
- [ ] Whitelist validation (not blacklist)
- [ ] Content-Type validation for uploads
- [ ] File size limits enforced
- [ ] Parameterized queries (no string concatenation)
- [ ] NoSQL injection prevention

**Output Encoding:**
- [ ] XSS prevention (escape HTML, JS, CSS)
- [ ] Content Security Policy (CSP) configured
- [ ] JSON responses properly encoded
- [ ] Error messages don't leak sensitive data

**Security Headers:**
- [ ] Strict-Transport-Security (HSTS)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY or SAMEORIGIN
- [ ] Content-Security-Policy
- [ ] Referrer-Policy
- [ ] Permissions-Policy

**Cryptography:**
- [ ] HTTPS enforced (TLS 1.3 preferred)
- [ ] Sensitive data encrypted at rest
- [ ] Secure random number generation
- [ ] No hardcoded secrets in code
- [ ] Secrets in environment variables or vault

**API Security:**
- [ ] Rate limiting on public endpoints
- [ ] API authentication required
- [ ] CORS configured properly (not wildcard *)
- [ ] API versioning implemented
- [ ] Request size limits enforced
- [ ] GraphQL query depth limiting

**Dependencies:**
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (npm audit clean)
- [ ] Dependency scanning in CI/CD
- [ ] Lockfile committed (package-lock.json)

**Logging & Monitoring:**
- [ ] Security events logged (failed auth, privilege escalation)
- [ ] Logs don't contain sensitive data (passwords, tokens)
- [ ] Log retention policy defined
- [ ] Alerts for security anomalies
- [ ] Audit trail for admin actions

### Mobile App Security Checklist

**Data Storage:**
- [ ] Sensitive data in secure storage (Keychain, Keystore)
- [ ] No sensitive data in logs
- [ ] No sensitive data in screenshots/backups
- [ ] Database encryption enabled
- [ ] Cache cleared on logout

**Network:**
- [ ] Certificate pinning implemented
- [ ] TLS 1.3 enforced
- [ ] Public WiFi warnings
- [ ] VPN detection (if required)

**Code Protection:**
- [ ] Code obfuscation enabled (ProGuard, R8)
- [ ] Debug mode disabled in production
- [ ] No API keys hardcoded
- [ ] Root/jailbreak detection (if required)
- [ ] Anti-tampering checks

**Authentication:**
- [ ] Biometric authentication available
- [ ] PIN/passcode required
- [ ] Token refresh implemented
- [ ] Auto-logout on inactivity

---

## Security Audit Process

### Phase 1: Information Gathering
1. Map application architecture
2. Identify entry points (APIs, forms, file uploads)
3. List authentication mechanisms
4. Document sensitive data flows
5. Review third-party integrations

### Phase 2: Automated Scanning
1. Run dependency scanner (npm audit, Snyk)
2. Run SAST (SonarQube, Semgrep)
3. Run secret scanner (TruffleHog)
4. Run container scanner (Trivy)
5. Collect findings

### Phase 3: Manual Code Review
1. Review authentication logic
2. Review authorization checks
3. Check input validation
4. Review cryptography usage
5. Check security headers
6. Review error handling
7. Check logging practices

### Phase 4: Dynamic Testing
1. Test authentication bypass
2. Test authorization bypass (IDOR, privilege escalation)
3. Test injection vulnerabilities (SQL, XSS, command)
4. Test file upload security
5. Test session management
6. Test API rate limiting
7. Test CORS configuration

### Phase 5: Threat Modeling
1. Identify assets
2. Identify threats (STRIDE)
3. Identify vulnerabilities
4. Calculate risk (DREAD)
5. Prioritize mitigations

### Phase 6: Reporting
1. Categorize findings (Critical, High, Medium, Low)
2. Provide remediation steps
3. Estimate effort for fixes
4. Create JIRA tickets for vulnerabilities
5. Provide security roadmap

---

## Typical Workflows

### 1. Security Audit (Full)
**Command:** `security:audit`
- Run automated scans (deps, SAST, secrets)
- Manual code review (OWASP Top 10)
- Dynamic testing (DAST)
- Threat modeling
- Generate comprehensive report

### 2. Dependency Vulnerability Scan
**Command:** `security:deps`
- Run npm audit / yarn audit
- Run Snyk scan
- Check for outdated packages
- Identify vulnerable dependencies
- Provide upgrade recommendations

### 3. Code Security Scan
**Command:** `security:scan`
- Run SAST (SonarQube, Semgrep, ESLint security)
- Check for hardcoded secrets
- Check for insecure patterns
- Identify security hotspots
- Generate report

---

## Security Tools Installation

**Node.js:**
```bash
npm install helmet express-rate-limit express-validator
npm install --save-dev @microsoft/eslint-plugin-sdl
npm install --save-dev eslint-plugin-security
```

**Python:**
```bash
pip install bandit safety
pip install flask-talisman  # Security headers for Flask
```

**Container:**
```bash
# Trivy
brew install trivy
trivy image myimage:latest
```

**Secret Scanning:**
```bash
# TruffleHog
pip install trufflehog
trufflehog git https://github.com/myorg/myrepo
```

---

## Common Vulnerabilities & Fixes

### SQL Injection

**Vulnerable:**
```javascript
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);
```

**Secure:**
```javascript
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// Or with Prisma/TypeORM (safe by default)
prisma.user.findUnique({ where: { id: userId } });
```

### XSS (Cross-Site Scripting)

**Vulnerable:**
```javascript
res.send(`<h1>Hello ${username}</h1>`);
```

**Secure:**
```javascript
import DOMPurify from 'dompurify';
res.send(`<h1>Hello ${DOMPurify.sanitize(username)}</h1>`);

// Or use templating engines with auto-escaping
res.render('hello', { username });  // EJS, Handlebars auto-escape
```

### CSRF (Cross-Site Request Forgery)

**Vulnerable:**
```javascript
app.post('/transfer', (req, res) => {
  // No CSRF protection
  transfer(req.body.amount, req.body.to);
});
```

**Secure:**
```javascript
import csrf from 'csurf';
app.use(csrf({ cookie: true }));

app.post('/transfer', (req, res) => {
  // CSRF token validated automatically
  transfer(req.body.amount, req.body.to);
});
```

### Weak Password Hashing

**Vulnerable:**
```javascript
import crypto from 'crypto';
const hash = crypto.createHash('md5').update(password).digest('hex');
```

**Secure:**
```javascript
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);  // Cost factor 12
const valid = await bcrypt.compare(password, hash);
```

### Insecure Direct Object Reference (IDOR)

**Vulnerable:**
```javascript
app.get('/user/:id', (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);  // No authorization check
});
```

**Secure:**
```javascript
app.get('/user/:id', authenticate, (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = await User.findById(req.params.id);
  res.json(user);
});
```
