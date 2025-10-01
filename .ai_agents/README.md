# AI Agents Shared Folder

This folder is a lightweight coordination area for AI agents (Claude, Copilot, etc.) to record actions, artifacts, and handoffs.

Files and conventions
- `agent_log.json` — append-only log of agent actions (created by the helper script)
- Use `scripts/ai_agent_log_append.js` to append entries in a safe, structured manner.

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
