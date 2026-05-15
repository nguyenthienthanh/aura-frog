---
last_aligned_with: v3.7.3
status: current
audience: first-time
---

# Agent Selection Examples

Real examples of what the `agent-detector` skill picks and why. Score thresholds: **PRIMARY ≥80**, SECONDARY 50–79, OPTIONAL 30–49.

| You type | PRIMARY agent | Why (scoring breakdown) |
|---|---|---|
| "Add login form with email+password" | **frontend** | `form` +35, `login` +30, UI intent +50 = **115** |
| "Add rate-limit to /api routes" | **architect** | `api route` +55, `rate limit` +45, backend intent +50 = **150** |
| "Fix email template styling in Laravel" | **frontend** (in Laravel repo!) | `email template` +55, `styling` +40, Layer 0 overrides repo = **95** |
| "Optimize this slow query" | **architect** | `slow query` +50, `optimize` +35, database intent +55 = **140** |
| "Run OWASP audit on payment flow" | **security** | `OWASP` +55, `audit` +50, security intent +55 = **160** |
| "Write Cypress tests for checkout" | **tester** | `Cypress` +50, `tests` +55, test infra exists +30 = **135** |
| "Set up GitHub Actions for CI" | **devops** | `GitHub Actions` +55, `CI` +50, deployment intent +50 = **155** |
| "Fix FlatList performance in Expo" | **mobile** | `FlatList` +50, `Expo` +55, mobile intent +50 = **155** |
| "Should we build this feature?" | **strategist** | `should we` +50, business-question intent +55 = **105** |
| "What does this repo do?" | **scanner** | Project detection intent +60, cached context +40 = **100** |

**Key insight:** Layer 0 (task content) overrides repo type. A Laravel repo asking "fix email template styling" gets `frontend`, not `architect`. See `skills/agent-detector/task-based-agent-selection.md` for the full scoring matrix.

---
