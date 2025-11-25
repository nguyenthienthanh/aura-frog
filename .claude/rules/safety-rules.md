# Safety Rules - External System Interactions

**Version:** 1.0.0  
**Purpose:** Prevent accidental writes to external systems

---

## 🛡️ Core Safety Principles

### 1. Always Confirm Before Writing
**Rule:** NEVER write to external systems without explicit user confirmation

**Applies to:**
- JIRA (status updates, comments, subtasks)
- Confluence (page creation, updates)
- Slack (notifications)
- Linear (issue updates)
- Git (commits, pushes)

**Enforcement:** Show confirmation prompt, wait for user response

---

## ⚠️ Confirmation Required

### JIRA Operations
```markdown
⚠️ **CONFIRMATION REQUIRED: JIRA Write**

**Action:** Update ticket status
**Ticket:** PROJPH-1234
**From:** In Progress
**To:** Code Review

**Type "confirm" to proceed or "cancel" to skip**
```

### Confluence Operations
```markdown
⚠️ **CONFIRMATION REQUIRED: Confluence Write**

**Action:** Create page
**Space:** PROJ
**Title:** "Implementation Summary"

**Preview:**
[First 500 chars of content]

**Type "confirm" to proceed or "cancel" to skip**
```

### Git Operations
```markdown
⚠️ **CONFIRMATION REQUIRED: Git Commit**

**Files to commit:** 5 files
- src/features/sharing/ShareModal.tsx
- src/features/sharing/ShareModal.test.tsx
- ... (3 more)

**Commit message:**
feat(sharing): implement social media sharing

**Type "confirm" to proceed**
```

---

## ✅ No Confirmation Needed (Read-Only)

Safe operations that don't modify data:
- ✅ Fetch JIRA tickets
- ✅ Read Confluence pages
- ✅ List Linear issues
- ✅ Git status, log, diff
- ✅ Send Slack notifications (informational only)

---

## 🚫 Forbidden Operations

### Never Auto-Execute:
- ❌ Delete JIRA tickets
- ❌ Delete Confluence pages
- ❌ Force push to Git
- ❌ Delete Git branches
- ❌ Modify production data
- ❌ Run database migrations in production

**If user requests these:** Warn about risks and require explicit "I understand" confirmation

---

## 🔐 Security Rules

### API Keys & Tokens
```yaml
Storage:
  ✅ Environment variables
  ✅ .envrc (with direnv)
  ❌ Never in code
  ❌ Never in config files
  ❌ Never in git

Access:
  ✅ Read from process.env
  ✅ Masked in logs
  ❌ Never log full tokens
  ❌ Never show in UI
```

### Sensitive Data
```yaml
Never log or expose:
  - API tokens
  - Passwords
  - Private keys
  - User PII
  - Database credentials

Always redact:
  - Tokens in error messages
  - Credentials in stack traces
  - Sensitive data in reports
```

---

## ⏸️ Approval Gates

### Phase Approval Gates
```markdown
Every phase requires approval:

Phase 1: Requirements → APPROVAL
Phase 2: Technical Planning → APPROVAL
Phase 3: Design Review → APPROVAL
Phase 4: Test Planning → APPROVAL
Phase 5a: Write Tests → APPROVAL
Phase 5b: Implement → APPROVAL
Phase 5c: Refactor → APPROVAL
Phase 6: Code Review → APPROVAL
Phase 7: QA Validation → APPROVAL
Phase 8: Documentation → APPROVAL
Phase 9: Notification → Auto (read-only)
```

### Code Generation Gates
```markdown
Before generating/modifying code:

1. Show files to be affected
2. Describe changes
3. Estimate impact (LOC, breaking changes)
4. Request approval

User must type "proceed" or "confirm"
```

---

## 🎯 Error Handling

### Failed Operations
```typescript
try {
  await jiraApi.updateStatus(ticketId, newStatus);
} catch (error) {
  // Log error (sanitized)
  logger.error('JIRA update failed', {
    ticketId,
    // Don't log token or sensitive data
  });
  
  // User-friendly message
  showError('Failed to update JIRA ticket. Please try again or update manually.');
  
  // Don't throw - allow workflow to continue
}
```

### Rollback on Failure
```typescript
// If multi-step operation fails, rollback completed steps
try {
  await step1();
  await step2();
  await step3(); // Fails here
} catch (error) {
  // Rollback step2 and step1
  await rollback();
  throw new RollbackError('Operation failed, changes reverted');
}
```

---

## 📝 Audit Trail

### Log All External Writes
```typescript
interface AuditLog {
  timestamp: Date;
  action: string;
  system: 'jira' | 'confluence' | 'git' | 'slack';
  userId: string;
  details: {
    before?: any;
    after?: any;
    approved: boolean;
  };
}

// Log every write operation
await auditLogger.log({
  timestamp: new Date(),
  action: 'jira:update_status',
  system: 'jira',
  userId: currentUser.id,
  details: {
    before: 'In Progress',
    after: 'Code Review',
    approved: true,
  },
});
```

---

## 🔄 Retry Logic

### Safe Retry Pattern
```typescript
async function safeRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}

// Usage
await safeRetry(() => jiraApi.updateStatus(id, status));
```

---

## ✅ Checklist Before External Write

- [ ] User explicitly requested this action
- [ ] Confirmation prompt shown
- [ ] User confirmed (typed "confirm")
- [ ] Operation is safe (no destructive action)
- [ ] Sensitive data redacted from logs
- [ ] Audit log entry created
- [ ] Error handling in place
- [ ] Rollback plan exists
- [ ] User notified of result

---

## 🚨 Emergency Stop

### User Can Always Stop
```
User types: "stop", "cancel", "abort"
→ Immediately halt all operations
→ Rollback pending changes
→ Return to safe state
```

---

**Remember:** When in doubt, ASK for confirmation. Better safe than sorry! 🛡️

