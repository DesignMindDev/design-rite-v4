# AI Agents Shared Folder

This folder is a lightweight coordination area for AI agents (Claude, Copilot, etc.) to record actions, artifacts, and handoffs.

Files and conventions
- `agent_log.json` — append-only log of agent actions (created by the helper script)
- Use `scripts/ai_agent_log_append.js` to append entries in a safe, structured manner.

Approval workflow (for autonomous agents):

- Before any agent proposes applying code edits, the agent MUST produce a list of files to change and a compact patch, then wait for human approval.
- Human approval is granted by adding a new entry to `agent_log.json` containing the exact string `APPROVE_CLAUDE_CHANGES` and a timestamp. Agents must check for this entry before making edits.
- See `.ai_agents/CLAUDE_UPDATE_2025-10-01.md` and `.ai_agents/CLAUDE_REMEDIATION_PROMPT.md` for the exact confirmation requirements.

Canonical next-action labels (use these to coordinate automated work):
- `fix-transform`
- `test-auth`
- `test-import`
- `test-webhooks`
- `investigate-failure`
- `run-security-tests`
- `run-next-area:import`

Watcher
- Run `npm run watch-tests` to start a file watcher that runs `npm run test:log` on changes and appends a suggested next action to `agent_log.json`.

Security
- Never write secrets or API tokens into this folder.
