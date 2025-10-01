## Remediation steps for Design-Rite (for Claude)

Context:
- Repository root: C:/Users/dkozi/Projects/Design-Rite/v3/design-rite-v3.1/design-rite-v3
- CI: none configured yet (recommend GitHub Actions)

Findings (from `npm audit`):
- `next`: critical advisories; safe fix: upgrade to `next@14.2.33`.
- `xlsx` (SheetJS): high severity (prototype pollution, ReDoS); no direct fix reported.

Tasks (implement and test):
1. Update `package.json` to use `next@14.2.33` and run tests.
2. Add defensive checks around `xlsx` usage: limit file size, sanitize cell content, and validate types. Consider replacing with a lighter, maintained parser if appropriate.
3. Harden Spatial Studio APIs:
   - Add file size and type validation in `app/api/spatial-studio/upload-floorplan/route.ts` (reject >10MB and non-PDF/PNG/JPG).
   - Wrap OpenAI calls with a 20-25s timeout and return deterministic fallback JSON when AI is unavailable.
   - Add explicit GET health endpoints returning 200 and config flags.
4. Run unit tests and integration tests: `node ./scripts/run_tests_and_log.js --agent=CLAUDE`.
5. Create a PR with code changes and include `tmp/jest_results.json` in the PR description.

Constraints:
- Do not run penetration or exploit tests. Provide remediation only and recommend authorized scans (OWASP ZAP) with scheduling instructions.

Safety & confirmation policy (READ BEFORE REMEDIATION):

- BEFORE proposing or applying any file edits, you MUST:
   1. List every file you intend to change and provide a one-line reason why each file is required.
   2. Mark any files you believe are unused as "candidate for removal" with rationale and potential risks.
   3. Provide a compact unified-diff style patch showing only the minimal changes.
   4. WAIT for an explicit approval token. The human operator will add the exact line APPROVE_CLAUDE_CHANGES to `.ai_agents/agent_log.json` (with timestamp) to authorize applying edits.

- If the approval token is not present, do not propose to modify files — instead, provide a remediation plan and ask clarifying questions.

Output expected from Claude:
- A patch/PR with the code changes, test updates, and a summary of commands run + test results.

If you are asked to make changes now, follow the safety policy strictly and do not perform edits until the approval token is present.
