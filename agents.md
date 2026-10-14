# AGENTS.md

## Commands

- `pnpm dev` # Start dev server
- `pnpm build` # Typecheck + build (CI-like sanity check)
- `pnpm lint:fix` # Auto-fix linting issues

Run `pnpm lint:fix` after code changes.

If the project has tests configured (e.g. a `test` script), run them as well.

## Strong Constraints (Required)

- Always run `pnpm build` for any non-trivial change (not just UI text).
- If you modify core logic (e.g. `src/lib/**`, `src/utils/**`, `src/composables/**`, `src/services/**`, `src/router/**`, `src/stores/**`):
  - If the repo has a test runner/script (e.g. `pnpm test` / `pnpm test:unit`): add/adjust automated tests in the same change and run the tests.
  - If the repo still has no test runner:
    - Tests are optional but strongly recommended.
    - Add “Testing Notes” in the PR/commit description explaining the risk and the manual/alternative checks performed.
    - Consider adding a minimal unit test setup (recommended) once the team decides to introduce testing.

## Stack

- vue, shadcn-vue, tailwindcss, tanstack/vue-form, typescript, zod

## Structure

- `src/` - Vue application
- `vite.config.ts` - vite config

## Further Reading

- `.agents/skills/shadcn-vue-admin/references/SYSTEM_KNOWLEDGE_MAP.md`
- `.agents/skills/shadcn-vue-admin/references/testing-strategy.md`

<!-- harness:instructions:start -->
<comet-ambient-resume>
<!-- Managed by Comet. Edits inside this block may be replaced by comet init/update. -->
<!-- Contract: comet.resume_probe.v2 -->

## Comet Ambient Resume

在这个仓库中，开始处理需要改动或调查的任务前，如果可能存在活跃 Comet workflow，把当前用户请求传入只读探针：`comet resume-probe . --stdin --json`。

- 如果用户通过宿主明确调用任意 Comet Skill（例如 `@comet`、`/comet`、`@comet-native` 或 `/comet-hotfix`），显式调用优先于本恢复协议；不要运行 resume probe，直接进入被调用的 Skill。
- 如果用户通过宿主明确调用的是非 Comet 的 Skill 或斜杠命令，任务意图已由该调用明确：不要运行 resume probe，直接执行该 Skill。
- 如果你正在 Comet 流程内（包括正在等待用户回复你在流程中提出的问题），不要运行 resume probe；把这类回复（例如方案/选项选择）当作当前 change 的继续，直接按用户的选择推进。
- 只信任返回的 `workflow`、`skill` 和 `entrySource`；它们只由项目配置或无配置兼容回退决定。不得扫描或切换另一套 workflow。
- 如果 probe 返回 `auto_resume`，简短说明选中的 active change，并进入 `nextCommand` 指向的永久入口。不要把状态命令当作恢复入口直接推进。
- 如果 probe 返回 `ask_user`，只问一个简短问题并等待用户回复。
- 如果当前请求未明确调用 Comet Skill，且 probe 返回 `out_of_scope` 或 `none`，不要进入 Comet workflow。
- `out_of_scope` 或 `none` 只表示不要因为这个新请求进入 Comet workflow；它绝不表示要暂停或退出一个已在进行的 Comet 流程。
- 如果配置或状态无效且没有 `nextCommand`，停止并报告原因；不要猜测另一个 workflow。
- 不能只因为存在 active change 就把无关任务挂到该 change。Native 的未提交改动由 Native 入口检查，不由探针自动归因。
</comet-ambient-resume>

## Harness project rules

- Read and follow `.opencode/rules/comet-workflow-guard.md`.
- Read and follow `.claude/rules/comet-workflow-guard.md`.
- Read and follow `.trae/rules/comet-workflow-guard.md`.
- Read and follow `.codex/rules/comet-workflow-guard.md`.
- For coding, follow `.agents/skills/ponytail/SKILL.md` when Ponytail is active. OpenCode uses its native plugin to manage the active mode, including off; other hosts default to full. User requests to stop or switch mode take precedence.
- Before using upstream tool examples, read `.agents/skills/harness-tools/SKILL.md`; use the installed user `comet` command directly. If the host has not reloaded PATH, use `& "C:/Users/gavin/.harness/shared/current/harness.exe" --root "G:/aiProj/shadcn-vue-admin" tool comet -- <same arguments>` in PowerShell; omit `&` in Bash. Translate bare `openspec ...` to the equivalent project OpenSpec wrapper.
- Read `RTK.md` for global RTK command output compression. Platform hooks rewrite supported shell commands without executing them; the host retains its normal command approval policy.

## CodeGraph 使用规则

- 理解工程结构、定位实现、追踪调用链，以及修复或重构代码前，优先使用 `codegraph_explore`。
- `query` 应包含具体问题，以及已知的函数名、类名或文件路径。追踪流程时同时提供入口和目标符号；名称不匹配时根据返回的候选名称重新查询。
- 先做一次聚焦查询，再针对缺失的信息补充查询。不要逐文件 grep 重建调用链，也不要一次要求输出整个仓库。
- 返回的带行号源码视为已经阅读，可直接用于分析和定位修改。不要重复读取已经完整返回且未过期的内容。
- 修改前检查调用者、被调用函数、依赖关系及影响范围，据此确定需要同步修改的位置和相关测试。
- 留意截断、过期、歧义和未覆盖提示。结果不足时用具体符号或路径继续查询；未找到结果不等于没有调用者、没有影响或代码未使用。
- 确认查询的是目标项目；默认项目不正确或查询其他项目时，显式传入 `projectPath`。`maxFiles` 只控制返回文件数，不代表完整覆盖。
- 本项目 MCP 在会话运行期间自动监听文件变化并增量更新索引；更新包含防抖和解析延迟。修改代码后，确认索引已更新，使用更新后的索引判断调用关系或依赖变化；索引尚未更新时使用当前源码补证。`harness mcp codegraph --no-watch` 请求新共享服务不监听；已有服务保留启动时的策略。
- MCP 不可用但索引可用时，使用 `harness tool codegraph --root "<项目绝对路径>" -- explore "<问题、符号或文件路径>"`。
- 索引缺失、过期或覆盖不足时，定点读取相关源码并说明限制。配置、文档和字符串字面量可直接使用文本搜索。
- CodeGraph 用于结构分析；修改是否正确仍须通过适当的编译、测试或 lint 验证。

### Comet Classic 执行约定

- 优先使用原生 write/edit 工具。宿主工具不可用且当前阶段允许写入目标时才使用 shell；守卫报错先定位原因再重试。
- Windows 文件读写显式使用 UTF-8 无 BOM。PowerShell 5.1 的 `Set-Content -Encoding utf8` 会写 BOM，`>` 会写 UTF-16。允许使用 shell 时采用：

```powershell
$utf8 = [System.Text.UTF8Encoding]::new($false, $true)
$text = [System.IO.File]::ReadAllText($path, $utf8)
[System.IO.File]::WriteAllText($path, $text, $utf8)
```

- 机器 JSON 使用 UTF-8 stdin/stdout 或显式 UTF-8 文件读取，再用 JSON 解析器；修复编码问题，不用正则提取字段。
- 制定验收前确认现有测试、lint、typecheck 基线；记录已有失败，要求改动相关的定向检查通过，全仓诊断不超出已记录的基线。
- 定点编辑 `tasks.md`，保留各行 `<!-- comet-task:UUID -->` 及计划引用。修改文字会改变 revision，不会改变保留的 ID；先核对需求变化，再为 `task-complete` 重新读取 revision，不能盲目重试；仅给缺少 ID 的任务分配 ID。
- Build 仍激活时完成 `task-complete` 和需要的 checkpoint，再从 Build 推进到 Verify。
- 交付 `local` 要求创建本地归档提交，不推送。用户要求不提交时保留待交付状态并说明未满足的条件；不能宣称 local 已验证，也不要在没有新证据时反复验证。
- 计划篇幅与改动规模相称。仅复用 Runtime 接受的相同输入检查证据；输入变化或证据失效时重跑，保留必需守卫与独立审查。

<!-- harness:instructions:end -->

---

<!-- fallow:setup-hooks:start -->

## Fallow checks

Use fallow for code-quality, cleanup, and setup tasks in this repository. Fallow checks the changed code before each `git commit` and `git push`. In Claude Code and Codex, a PreToolUse hook from `fallow agent install` runs this check and blocks the command when the verdict is `fail`. Other agents run the check themselves: `fallow audit --format json --quiet --explain --gate-marker agent`. If the verdict is `fail`, fix the reported findings before you try again. A JSON runtime error such as `{ "error": true, ... }` does not block.

Audit defaults to `gate=new-only`: only findings introduced by the current changeset affect the verdict. Inherited findings on touched files are reported under `attribution` and annotated with `introduced: false`, but do not block the commit. Set `[audit] gate = "all"` in `fallow.toml` to gate every finding in changed files.

For non-skill agents, treat the task map below as the local onboarding source: run the listed fallow command before destructive edits, before commits, and before pull request handoff.

## Fallow task map

| When the agent is about to...                                        | Run                                                                                                                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delete an "unused" export or file                                    | `fallow dead-code --trace <file>:<export>`                                                                                                                    |
| prove a TypeScript symbol's exact consumers before refactoring       | `fallow dead-code --type-aware --symbol-impact <file>:<export-or-class.method>`                                                                               |
| find how one module reaches another                                  | `fallow trace --path <from> <to>` (Reports `reachable: false` instead of failing when no import path exists; type-only hops are reported, not skipped.)       |
| delete an "unused" dependency                                        | `fallow dead-code --trace-dependency <name>`                                                                                                                  |
| migrate a dependency                                                 | `fallow trace --dependency <name> --sites` (Counts each imported name, follows one hop through project wrappers, and counts each use that it cannot resolve.) |
| commit or open a PR                                                  | `fallow audit --base <ref>`                                                                                                                                   |
| read a diff before approving it                                      | `fallow review --base <ref> --brief` (orientation, never gates: deterministic and always exit 0, unlike the audit row)                                        |
| prioritize refactoring                                               | `fallow health --hotspots --targets`                                                                                                                          |
| ask who owns code                                                    | `fallow health --ownership`                                                                                                                                   |
| check untested-but-reachable code                                    | `fallow health --coverage-gaps`                                                                                                                               |
| consolidate duplication                                              | `fallow dupes --trace dup:<fingerprint>`                                                                                                                      |
| find feature flags                                                   | `fallow flags`                                                                                                                                                |
| check which architecture rules apply to a file before changing it    | `fallow guard <files>`                                                                                                                                        |
| check import cycles, boundaries and policy rules after changing code | `fallow architecture`                                                                                                                                         |
| surface security candidates                                          | `fallow security`                                                                                                                                             |
| understand a finding                                                 | `fallow explain <issue-type>`                                                                                                                                 |
| scope a monorepo                                                     | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command)                                                                          |

<!-- fallow:setup-hooks:end -->

<!-- harness:instructions:start -->
<comet-ambient-resume>
<!-- Managed by Comet. Edits inside this block may be replaced by comet init/update. -->
<!-- Contract: comet.resume_probe.v2 -->

## Comet Ambient Resume

在这个仓库中，开始处理需要改动或调查的任务前，如果可能存在活跃 Comet workflow，把当前用户请求传入只读探针：`comet resume-probe . --stdin --json`。

- 如果用户通过宿主明确调用任意 Comet Skill（例如 `@comet`、`/comet`、`@comet-native` 或 `/comet-hotfix`），显式调用优先于本恢复协议；不要运行 resume probe，直接进入被调用的 Skill。
- 如果用户通过宿主明确调用的是非 Comet 的 Skill 或斜杠命令，任务意图已由该调用明确：不要运行 resume probe，直接执行该 Skill。
- 如果你正在 Comet 流程内（包括正在等待用户回复你在流程中提出的问题），不要运行 resume probe；把这类回复（例如方案/选项选择）当作当前 change 的继续，直接按用户的选择推进。
- 只信任返回的 `workflow`、`skill` 和 `entrySource`；它们只由项目配置或无配置兼容回退决定。不得扫描或切换另一套 workflow。
- 如果 probe 返回 `auto_resume`，简短说明选中的 active change，并进入 `nextCommand` 指向的永久入口。不要把状态命令当作恢复入口直接推进。
- 如果 probe 返回 `ask_user`，只问一个简短问题并等待用户回复。
- 如果当前请求未明确调用 Comet Skill，且 probe 返回 `out_of_scope` 或 `none`，不要进入 Comet workflow。
- `out_of_scope` 或 `none` 只表示不要因为这个新请求进入 Comet workflow；它绝不表示要暂停或退出一个已在进行的 Comet 流程。
- 如果配置或状态无效且没有 `nextCommand`，停止并报告原因；不要猜测另一个 workflow。
- 不能只因为存在 active change 就把无关任务挂到该 change。Native 的未提交改动由 Native 入口检查，不由探针自动归因。
</comet-ambient-resume>

## Harness project rules

- Read and follow `.opencode/rules/comet-workflow-guard.md`.
- Read and follow `.claude/rules/comet-workflow-guard.md`.
- Read and follow `.trae/rules/comet-workflow-guard.md`.
- Read and follow `.codex/rules/comet-workflow-guard.md`.
- For coding, follow `.agents/skills/ponytail/SKILL.md` when Ponytail is active. OpenCode uses its native plugin to manage the active mode, including off; other hosts default to full. User requests to stop or switch mode take precedence.
- Before using upstream tool examples, read `.agents/skills/harness-tools/SKILL.md`; use the installed user `comet` command directly. If the host has not reloaded PATH, use `& "C:/Users/gavin/.harness/shared/current/harness.exe" --root "G:/aiProj/shadcn-vue-admin" tool comet -- <same arguments>` in PowerShell; omit `&` in Bash. Translate bare `openspec ...` to the equivalent project OpenSpec wrapper.
- Read `RTK.md` for global RTK command output compression. Platform hooks rewrite supported shell commands without executing them; the host retains its normal command approval policy.

## CodeGraph 使用规则

- 理解工程结构、定位实现、追踪调用链，以及修复或重构代码前，优先使用 `codegraph_explore`。
- `query` 应包含具体问题，以及已知的函数名、类名或文件路径。追踪流程时同时提供入口和目标符号；名称不匹配时根据返回的候选名称重新查询。
- 先做一次聚焦查询，再针对缺失的信息补充查询。不要逐文件 grep 重建调用链，也不要一次要求输出整个仓库。
- 返回的带行号源码视为已经阅读，可直接用于分析和定位修改。不要重复读取已经完整返回且未过期的内容。
- 修改前检查调用者、被调用函数、依赖关系及影响范围，据此确定需要同步修改的位置和相关测试。
- 留意截断、过期、歧义和未覆盖提示。结果不足时用具体符号或路径继续查询；未找到结果不等于没有调用者、没有影响或代码未使用。
- 确认查询的是目标项目；默认项目不正确或查询其他项目时，显式传入 `projectPath`。`maxFiles` 只控制返回文件数，不代表完整覆盖。
- 本项目 MCP 在会话运行期间自动监听文件变化并增量更新索引；更新包含防抖和解析延迟。修改代码后，确认索引已更新，使用更新后的索引判断调用关系或依赖变化；索引尚未更新时使用当前源码补证。`harness mcp codegraph --no-watch` 请求新共享服务不监听；已有服务保留启动时的策略。
- MCP 不可用但索引可用时，使用 `harness tool codegraph --root "<项目绝对路径>" -- explore "<问题、符号或文件路径>"`。
- 索引缺失、过期或覆盖不足时，定点读取相关源码并说明限制。配置、文档和字符串字面量可直接使用文本搜索。
- CodeGraph 用于结构分析；修改是否正确仍须通过适当的编译、测试或 lint 验证。

### Comet Classic 执行约定

- 优先使用原生 write/edit 工具。宿主工具不可用且当前阶段允许写入目标时才使用 shell；守卫报错先定位原因再重试。
- Windows 文件读写显式使用 UTF-8 无 BOM。PowerShell 5.1 的 `Set-Content -Encoding utf8` 会写 BOM，`>` 会写 UTF-16。允许使用 shell 时采用：

```powershell
$utf8 = [System.Text.UTF8Encoding]::new($false, $true)
$text = [System.IO.File]::ReadAllText($path, $utf8)
[System.IO.File]::WriteAllText($path, $text, $utf8)
```

- 机器 JSON 使用 UTF-8 stdin/stdout 或显式 UTF-8 文件读取，再用 JSON 解析器；修复编码问题，不用正则提取字段。
- 制定验收前确认现有测试、lint、typecheck 基线；记录已有失败，要求改动相关的定向检查通过，全仓诊断不超出已记录的基线。
- 定点编辑 `tasks.md`，保留各行 `<!-- comet-task:UUID -->` 及计划引用。修改文字会改变 revision，不会改变保留的 ID；先核对需求变化，再为 `task-complete` 重新读取 revision，不能盲目重试；仅给缺少 ID 的任务分配 ID。
- Build 仍激活时完成 `task-complete` 和需要的 checkpoint，再从 Build 推进到 Verify。
- 交付 `local` 要求创建本地归档提交，不推送。用户要求不提交时保留待交付状态并说明未满足的条件；不能宣称 local 已验证，也不要在没有新证据时反复验证。
- 计划篇幅与改动规模相称。仅复用 Runtime 接受的相同输入检查证据；输入变化或证据失效时重跑，保留必需守卫与独立审查。

<!-- harness:instructions:end -->

---

<!-- fallow:setup-hooks:start -->

## Fallow checks

Use fallow for code-quality, cleanup, and setup tasks in this repository. Fallow checks the changed code before each `git commit` and `git push`. In Claude Code and Codex, a PreToolUse hook from `fallow agent install` runs this check and blocks the command when the verdict is `fail`. Other agents run the check themselves: `fallow audit --format json --quiet --explain --gate-marker agent`. If the verdict is `fail`, fix the reported findings before you try again. A JSON runtime error such as `{ "error": true, ... }` does not block.

Audit defaults to `gate=new-only`: only findings introduced by the current changeset affect the verdict. Inherited findings on touched files are reported under `attribution` and annotated with `introduced: false`, but do not block the commit. Set `[audit] gate = "all"` in `fallow.toml` to gate every finding in changed files.

For non-skill agents, treat the task map below as the local onboarding source: run the listed fallow command before destructive edits, before commits, and before pull request handoff.

## Fallow task map

| When the agent is about to...                                        | Run                                                                                                                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delete an "unused" export or file                                    | `fallow dead-code --trace <file>:<export>`                                                                                                                    |
| prove a TypeScript symbol's exact consumers before refactoring       | `fallow dead-code --type-aware --symbol-impact <file>:<export-or-class.method>`                                                                               |
| find how one module reaches another                                  | `fallow trace --path <from> <to>` (Reports `reachable: false` instead of failing when no import path exists; type-only hops are reported, not skipped.)       |
| delete an "unused" dependency                                        | `fallow dead-code --trace-dependency <name>`                                                                                                                  |
| migrate a dependency                                                 | `fallow trace --dependency <name> --sites` (Counts each imported name, follows one hop through project wrappers, and counts each use that it cannot resolve.) |
| commit or open a PR                                                  | `fallow audit --base <ref>`                                                                                                                                   |
| read a diff before approving it                                      | `fallow review --base <ref> --brief` (orientation, never gates: deterministic and always exit 0, unlike the audit row)                                        |
| prioritize refactoring                                               | `fallow health --hotspots --targets`                                                                                                                          |
| ask who owns code                                                    | `fallow health --ownership`                                                                                                                                   |
| check untested-but-reachable code                                    | `fallow health --coverage-gaps`                                                                                                                               |
| consolidate duplication                                              | `fallow dupes --trace dup:<fingerprint>`                                                                                                                      |
| find feature flags                                                   | `fallow flags`                                                                                                                                                |
| check which architecture rules apply to a file before changing it    | `fallow guard <files>`                                                                                                                                        |
| check import cycles, boundaries and policy rules after changing code | `fallow architecture`                                                                                                                                         |
| surface security candidates                                          | `fallow security`                                                                                                                                             |
| understand a finding                                                 | `fallow explain <issue-type>`                                                                                                                                 |
| scope a monorepo                                                     | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command)                                                                          |

<!-- fallow:setup-hooks:end -->
