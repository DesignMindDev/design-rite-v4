# Security Best Practices - Design-Rite V4

**Last Updated:** October 18, 2025
**Status:** Mandatory for all commits

---

## 🚨 NEVER COMMIT SECRETS TO GIT

### **Critical Rule:**
**NEVER place secrets, API keys, tokens, or sensitive data in git commits.**

Even if you delete the file later, it remains in git history forever and can be discovered by:
- GitGuardian (automated scanning)
- GitHub secret scanning
- Manual git log inspection
- Public repository forks

---

## 🔑 Types of Secrets to NEVER Commit

### **1. API Keys & Tokens**
❌ **NEVER:**
```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
OPENAI_API_KEY=sk-proj-xxxxx
SUPABASE_SERVICE_KEY=eyJhbGci...
```

✅ **INSTEAD:**
```bash
# .env (gitignored)
STRIPE_SECRET_KEY=sk_live_xxxxx

# Documentation files
STRIPE_SECRET_KEY=sk_live_... (check Render dashboard)
```

### **2. Webhook Secrets**
❌ **NEVER:**
```markdown
Current webhook secret: whsec_Vh8ERs6CgFysvS2pkb5xvHHiKAldULIG
```

✅ **INSTEAD:**
```markdown
Current webhook secret: whsec_... (stored in Render env vars)
To retrieve: https://dashboard.render.com/web/srv-.../env
```

### **3. Database Credentials**
❌ **NEVER:**
```javascript
const connection = {
  host: 'db.example.com',
  password: 'MyP@ssw0rd123'
}
```

✅ **INSTEAD:**
```javascript
const connection = {
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD
}
```

### **4. JWT Secrets**
❌ **NEVER:**
```typescript
const JWT_SECRET = "my-super-secret-key-123"
```

✅ **INSTEAD:**
```typescript
const JWT_SECRET = process.env.JWT_SECRET!
```

---

## 📋 .gitignore Rules

Our `.gitignore` is configured to catch common secret patterns:

```gitignore
# Environment files
.env
.env.*

# API Keys
*.key
*.pem
credentials.json

# Documentation with secrets
*DIAGNOSTIC*.md
*_WEBHOOK_*.md
*SECRET*.md
STRIPE_WEBHOOK_DIAGNOSTIC.md
```

---

## ✅ Safe Patterns for Documentation

### **Pattern 1: Redact Actual Values**
```markdown
## Environment Variables
STRIPE_SECRET_KEY=sk_test_51Rdsn800jf1eOeXQ... (redacted)
STRIPE_WEBHOOK_SECRET=whsec_... (check Render dashboard)
```

### **Pattern 2: Use Placeholders**
```markdown
## Configuration
STRIPE_SECRET_KEY=<your-stripe-secret-key>
OPENAI_API_KEY=<your-openai-api-key>
```

### **Pattern 3: Reference External Sources**
```markdown
## Where to Find Secrets
- Stripe keys: https://dashboard.stripe.com/apikeys
- Supabase keys: https://supabase.com/dashboard/project/.../settings/api
- Render env vars: https://dashboard.render.com/web/srv-.../env
```

### **Pattern 4: Use Environment Variables**
```typescript
// ✅ Good - Uses env var
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// ❌ Bad - Hardcoded
const stripe = new Stripe('sk_test_51Rdsn800...')
```

---

## 🔧 How to Handle Accidental Commits

### **If You Accidentally Commit a Secret:**

1. **DON'T just delete the file in a new commit** - it's still in git history!

2. **DO rotate the secret immediately:**
   - Go to the service (Stripe, Supabase, etc.)
   - Generate a new secret/key
   - Update environment variables
   - Test that everything still works

3. **DO clean git history (if needed):**
   ```bash
   # Remove file from all commits (use with caution!)
   git filter-branch --index-filter \
     'git rm --cached --ignore-unmatch FILENAME' HEAD

   # Or use BFG Repo-Cleaner (safer)
   bfg --delete-files FILENAME
   ```

4. **DO force push (ONLY if repository is private and you coordinate with team):**
   ```bash
   git push --force origin main
   ```

5. **IF repository is public:**
   - Assume the secret is compromised
   - Rotate immediately
   - Consider the secret permanently exposed

---

## 🎯 Checklist Before Committing

Before every commit, verify:

- [ ] No `.env` files included
- [ ] No API keys in code or docs
- [ ] No hardcoded passwords
- [ ] No webhook secrets
- [ ] No database credentials
- [ ] No JWT secrets
- [ ] All secrets use environment variables
- [ ] Documentation uses placeholders or redacted values

---

## 🛡️ Security Tools

### **1. GitGuardian**
- Automatically scans commits for secrets
- Sends email alerts when secrets detected
- **Action:** Rotate secret immediately if alerted

### **2. GitHub Secret Scanning**
- Built into GitHub
- Blocks pushes with known secret patterns
- **Action:** Remove secret and try again

### **3. Pre-commit Hooks**
You can add pre-commit hooks to catch secrets:

```bash
# .git/hooks/pre-commit
#!/bin/bash
if git diff --cached | grep -E "(SECRET|KEY|PASSWORD|TOKEN)" | grep -v ".gitignore"; then
    echo "❌ Warning: Potential secret detected in commit"
    echo "Please review your changes and remove any secrets"
    exit 1
fi
```

---

## 📚 Environment Variable Management

### **Development (.env.local)**
```bash
# Never commit this file!
STRIPE_SECRET_KEY=sk_test_xxx
SUPABASE_SERVICE_KEY=eyJxxx
```

### **Production (Render Dashboard)**
1. Go to: https://dashboard.render.com/web/srv-.../env
2. Add environment variables via UI
3. Service auto-restarts with new values
4. Never copy production secrets to local files

### **Sharing Secrets with Team**
❌ **NEVER via:**
- Git commits
- Slack/email
- Screenshots
- Shared documents

✅ **INSTEAD use:**
- Password managers (1Password, LastPass)
- Encrypted vaults (Vault by HashiCorp)
- Secure sharing tools (send.bitwarden.com)
- In-person transfer
- Render team access (share dashboard access, not secrets)

---

## 🚨 Recent Incident: Stripe Webhook Secret

**What Happened:**
- October 18, 2025: Accidentally committed `STRIPE_WEBHOOK_DIAGNOSTIC.md` with actual webhook secret
- GitGuardian detected and sent alert
- GitHub push protection blocked initial attempt
- Secret was still exposed in one commit

**Actions Taken:**
1. ✅ Removed secret from documentation
2. ✅ Updated `.gitignore` to prevent future occurrences
3. ✅ Committed redacted version
4. ⏳ **TODO:** Rotate webhook secret in Stripe dashboard
5. ⏳ **TODO:** Update Render environment variable

**Lesson Learned:**
- Even diagnostic/troubleshooting docs can contain secrets
- Always use placeholders or "check dashboard" references
- Git history is permanent - prevention is key

---

## 📖 Additional Resources

- **OWASP Secrets Management**: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- **GitHub Secret Scanning**: https://docs.github.com/en/code-security/secret-scanning
- **GitGuardian Best Practices**: https://www.gitguardian.com/
- **Render Environment Variables**: https://render.com/docs/environment-variables

---

## ✅ Summary

1. **NEVER commit secrets to git**
2. **ALWAYS use environment variables**
3. **REDACT or use placeholders in documentation**
4. **ROTATE secrets if accidentally exposed**
5. **CHECK before every commit**

**When in doubt, ask: "Would I be okay if this was public?"**

If the answer is no, don't commit it! 🔒

---

**Last Updated:** October 18, 2025
**Next Review:** Monthly security audit
