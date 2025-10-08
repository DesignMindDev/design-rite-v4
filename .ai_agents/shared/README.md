Shared workspace for Claude <-> Copilot interactions

Folder structure
- `.ai_agents/shared/to_review/` - Files created by the watcher (or notify script) to notify Claude that there is work to review. Each file is JSON with the queue item details.
- `.ai_agents/shared/completed/` - Claude places completed work artifacts here (markdown, patches, archives). Filenames SHOULD include the original request id (e.g., `req_169xxx-complete.md`).
- `.ai_agents/shared/archive/` - Completed artifacts can be moved here after assistant confirmation.

Workflow
1. Copilot watcher or `notify_claude.js` will create one JSON file per pending queue item in `to_review/` to notify Claude.
2. Claude reviews the file, performs work locally, and places the completed artifact into `completed/` with a filename that contains the original request id.
3. Claude runs `node .ai_agents/claude_complete.js --id=<requestId> --file=.ai_agents/shared/completed/<filename> --reviewer=Claude` to mark the item completed. This updates `command_queue.json` and appends an entry to `agent_log.json`.
4. Assistant (you) runs `node .ai_agents/assistant_confirm.js` to scan `completed/`, validate presence, append confirmation logs, and optionally approve the next low-risk queued items using `--approve-next`.

Safety notes
- These scripts only modify `.ai_agents/command_queue.json` and `.ai_agents/agent_log.json` and the `shared` folder contents. They do not modify source code files.
- Files will not be overwritten unless explicitly specified by flags.
