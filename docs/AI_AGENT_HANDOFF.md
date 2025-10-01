# AI Agent Handoff & Coordination (Claude ↔ Copilot)

Purpose
- Provide clear, machine- and human-readable instructions that Claude (or other AI agents) can follow to understand recent changes, run the test scripts added to the repo, and record results in a shared place that other agents (including Copilot) can read.

Overview of what was added
- scripts/system_surveyor_load_test.js — concurrent load-test agent for the System Surveyor endpoints.
- scripts/ss_xlsx_to_json.js — converter from System Surveyor XLSX export to a normalized survey JSON object.
- scripts/ai_agent_log_append.js — small helper to append audit/log entries to the shared agent log.
- docs/SYSTEM_SURVEYOR_SWOT.md — SWOT analysis for the System Surveyor integration.
- docs/AI_AGENT_HANDOFF.md — (this file) guidance for agents.
- .ai_agents/ — shared folder for agents to record actions and artifacts (README + template log).

Goals for an agent (step-by-step)
1. Read this file to understand the recent changes and the scripts available.
2. If testing locally, ensure Node 18+ and install the small dependencies:
   - `npm install --no-save minimist xlsx`
3. Use `scripts/ss_xlsx_to_json.js` to convert local XLSX exports into `.tmp/survey.json` for test input. Example (PowerShell):
   ```powershell
   node .\scripts\ss_xlsx_to_json.js "C:\path\to\survey.xlsx" .\tmp\survey.json
   ```
4. Run the load test script to exercise the API endpoints (supply a token if available):
   ```powershell
   node .\scripts\system_surveyor_load_test.js --baseUrl=http://localhost:3000 --token=YOUR_TOKEN --concurrency=5 --iterations=20
   ```
5. Record test results and any produced artifacts by writing a log entry to the shared `.ai_agents/agent_log.json` using the helper:
   ```powershell
   node .\scripts\ai_agent_log_append.js --agent="Claude" --action="run-load-test" --command="node ./scripts/...?" --status="success" --details="20 imports, 18 successes, 2 fails" --artifact="./tmp/report.csv"
   ```
   The helper will create `.ai_agents/agent_log.json` if missing and append a new JSON entry.

Handoff conventions (important)
- Use the `.ai_agents/agent_log.json` file as the canonical, append-only log of AI agent actions and artifacts.
- Each log entry should include these fields: id, agent, timestamp, action, command, status, details, artifacts (array of file paths).
- Prefer short, deterministic commands in the `command` field so other agents can re-run them.
- If creating a new artifact (JSON, CSV, screenshot), reference its path in `artifacts` and ensure it's committed or placed under a shared location in the workspace.

Security note
- Do not store secrets (API tokens, private keys) in the log or commit them. If a token is used for a run, reference it as `env:SS_TOKEN` and rotate/remove it after tests.

Example agent workflow (Claude)
1. Convert XLSX → JSON (local path). 2. POST the JSON to the import endpoint via the running dev server. 3. Validate response and save transformed DesignRite JSON to `tmp/`. 4. Append a log entry describing the run and attach the JSON.

If you are an AI agent reading this: follow these steps and append a log entry so a human or another agent can pick up your work.
