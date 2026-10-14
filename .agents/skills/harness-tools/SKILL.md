---
name: harness-tools
description: Use the seven shared Harness components without network downloads; CodeGraph structure search, RTK output reduction, Comet Classic with OpenSpec and Superpowers, Ponytail skills, Sensors background checks.
---

# Project tools

Run from the project root. The installed user `harness` command uses the current shared toolchain for this project. If the host has not reloaded PATH, replace `harness` with `& "C:/Users/gavin/.harness/shared/current/harness.exe" --root "G:/aiProj/shadcn-vue-admin"` in PowerShell, or `"C:/Users/gavin/.harness/shared/current/harness.exe" --root "G:/aiProj/shadcn-vue-admin"` in Bash.

- Comet: `comet --help`. Harness installs this command into the user PATH from its embedded runtime. Harness projects use the same current shared toolchain. If this host has not reloaded PATH yet, use `& "C:/Users/gavin/.harness/shared/current/harness.exe" --root "G:/aiProj/shadcn-vue-admin" tool comet -- --help` in PowerShell; omit `&` in Bash.
- OpenSpec: `harness tool openspec -- --help` (Comet Classic owns `docs/openspec`.)
- CodeGraph: `harness tool codegraph -- --help`; use codegraph_explore for indexed source, call paths and impact, or the CLI explore command.
- RTK: `rtk --help`; supported shell commands are rewritten by the official global platform integration. Use `rtk gain --project` for project savings. Read `RTK.md` for explicit use, user-level Hook locations and output recovery.
- Sensors: `harness sensors --help` or `harness tool sensors -- --help`. Configure `.sensors/*.sensors.yaml`; SessionStart checks status and runs `sensors start .` in the background when needed, without `--show`. Failed startup warns on stderr and leaves the original hook running.
- Superpowers: load the full local brainstorming, writing-plans, executing-plans and verification skills as directed by Comet Classic.
- Ponytail: use the complete local `../ponytail/SKILL.md` when active. OpenCode delegates `/ponytail lite|full|ultra|off`, command registration and per-turn instructions to the bundled native plugin; its active mode takes precedence over the default full mode. Pi loads the full core skill through its prompt hook.

Upstream examples and dynamic next-action commands naming `comet` run directly using the installed user command. Translate bare `openspec` examples to the project OpenSpec wrapper with the same arguments. Restart an existing terminal or agent host after first installation to load the user PATH. Harness init/update manages project integration; do not reinitialize an installed Harness project with native Comet init. Run upstream Node scripts through `"C:/Users/gavin/.harness/shared/current/payload/tools/node/node.exe"`; do not fetch tools with npx/npm. In PowerShell, prefix an executable quoted as a string with `&`.
