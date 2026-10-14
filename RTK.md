<!-- harness:rtk:start -->

# Project command output

Supported shell commands are rewritten by the official global RTK hooks and plugins. Hooks only transform commands; the host still approves and executes them. Unsupported commands are unchanged.

RTK is installed into the user PATH by Harness. For explicit use, run `rtk <command and arguments>`. Restart an existing terminal or agent host after first installation to load the user PATH.

The official Hook configuration is user-level: Claude uses `~/.claude/settings.json`, Codex uses `$CODEX_HOME/hooks.json` (default `~/.codex/hooks.json`), and Trae uses `~/.trae/hooks.json` plus an existing `~/.trae-cn/hooks.json`. Project hooks provide Comet write/edit guards; a project RTK Hook is not required.

Treat condensed output as complete unless it reports truncation or contradicts the exit status. If needed, recover the original output with `rtk proxy <command and arguments>`. Inspect this project's savings with `rtk gain --project`. RTK and the compatibility commands `harness tool rtk`, `harness rewrite` and `harness rtk-hook` share the default user tracking database. Any legacy project RTK database is retained for historical records and does not collect new command statistics.
<!-- harness:rtk:end -->
