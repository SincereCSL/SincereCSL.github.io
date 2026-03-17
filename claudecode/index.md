# 转载：你不知道的 Claude Code：架构、治理与工程实践


> **转载声明：**
> 本文转载自 X (Twitter)，作者为 **Tw93** (@HiTw93)。
> 原文链接：[https://x.com/HiTw93/status/2032091246588518683](https://x.com/HiTw93/status/2032091246588518683)

## 0. 太长不读

今天这篇文章源于最近半年深度使用 Claude Code、两个账号每月 40 刀氪金换来的一些踩坑经验，希望能给大伙一些输入。

刚开始我也把它当 ChatBot 用，后来很快发现不对劲：上下文越来越乱、工具越来越多但效果越来越差、规则越写越长却越不遵守，折腾了一段时间，研究了 Claude Code 本身之后才意识到，这不是 Prompt 问题，而是这套系统的设计就是这样的。

这篇文章想和大伙聊聊这几个事：Claude Code 底层怎么运作、上下文为什么会乱以及怎么治理、Skills 和 Hooks 应该怎么设计、Subagents 的正确用法、Prompt Caching 的架构影响，以及怎么写一个真正有用的 CLAUDE.md。

我觉得最直接的理解方式，是把 Claude Code 拆成六层来看：

![架构分层](/posts/2026/03/claude_images/img_01.jpg)

| 层级 | 职责 |
| :--- | :--- |
| **CLAUDE.md / rules / memory** | 长期上下文，告诉 Claude "是什么" |
| **Tools / MCP** | 动作能力，告诉 Claude "能做什么" |
| **Skills** | 按需加载的方法论，告诉 Claude "怎么做" |
| **Hooks** | 强制执行某些行为，不依赖 Claude 自己判断 |
| **Subagents** | 隔离上下文的工作者，负责受控自治 |
| **Verifiers** | 验证闭环，让输出可验、可回滚、可审计 |

只强化其中一层，系统就会失衡，CLAUDE.md 写太长，上下文先污染自己了；工具堆太多了，选择就搞不清楚了；subagents 开得到处都是，状态就漂移了；验证这步跳过了，出了问题根本不知道是哪里挂的。

---

## 1. 它底层是怎么运行的

Claude Code 的核心不是"回答"，而是一个反复循环的代理过程：

![循环代理过程](/posts/2026/03/claude_images/img_02.jpg)

**收集上下文 -> 采取行动 -> 验证结果 -> [完成 or 回到收集]**

- **CLAUDE.md / Skills / Memory** -> 收集上下文
- **Tools / MCP** -> 采取行动
- **Hooks / 权限 / 沙箱** -> 验证结果

用了一段时间才意识到，卡住的地方几乎从来不是模型不够聪明，更多时候是给了它错误的上下文，或者写出来了但根本没法判断对不对，也没法撤回。

### 真正要关注的五个层面：

![五个层面](/posts/2026/03/claude_images/img_03.jpg)

| 层面 | 核心问题 | 主要载体 |
| :--- | :--- | :--- |
| **Context surface** | 哪些信息常驻，哪些按需加载 | CLAUDE.md、rules、memory、skills |
| **Action surface** | Claude 当前具备哪些动作能力 | built-in tools、MCP、plugins |
| **Control surface** | 哪些动作必须被约束、阻断或审计 | permissions、sandbox、hooks |
| **Isolation surface** | 哪些任务需要隔离上下文和权限 | subagents、worktrees、forked sessions |
| **Verification surface** | 如何判断任务完成且结果可信 | tests、lint、screenshots、logs、CI |

对着这几个面看，很多问题就好排查了。结果不稳定，查上下文加载顺序，不是模型的事；自动化失控，看控制层有没有设计，不是 agent 太主动；长会话质量下降，中间产物把上下文污染了，换个新会话比反复调 prompt 有用得多。

---

## 2. 概念边界：MCP / Plugin / Tools / Skills / Hooks / Subagents

![概念边界](/posts/2026/03/claude_images/img_04.jpg)

| 概念 | 运行时角色 | 解决什么 | 典型误用 |
| :--- | :--- | :--- | :--- |
| **CLAUDE.md** | 项目级持久契约 | 每次会话都必须成立的命令、边界、禁止项 | 写成团队知识库 |
| **.claude/rules/\*** | 路径或语言相关规则 | 目录、文件类型或语言级局部规范 | 所有规则都堆到根 CLAUDE.md |
| **Built-in Tools** | 内置能力 | 读文件、改文件、跑命令、搜索 | 把所有集成都塞进 shell |
| **MCP** | 外部能力接入协议 | 让 Claude 访问 GitHub、Sentry、数据库 | 接太多 server，工具定义挤爆上下文 |
| **Plugin** | 打包分发层 | 把 Skills/Hooks/MCP 一起分发 | 把 plugin 当成运行时 primitive |
| **Skill** | 按需加载的知识/工作流 | 给 Claude 一个”方法包” | skill 既像百科全书又像部署脚本 |
| **Hook** | 强制执行规则的拦截层 | 在生命周期事件前后执行规则 | 用 hook 替代所有模型判断 |
| **Subagent** | 隔离上下文的工作单元 | 并行研究、限制工具与权限 | 无边界 fan-out，治理失控 |

**简单记：**给 Claude 新动作能力用 Tool/MCP，给它一套工作方法用 Skill，需要隔离执行环境用 Subagent，要强制约束和审计用 Hook，跨项目分发用 Plugin。

---

## 3. 上下文工程：最重要的系统约束

很多人把上下文当”容量问题”，但卡住的地方通常不是不够长，而是太吵了，有用的信息被大量无关内容淹没了。

### 真实的上下文成本构成

Claude Code 的 200K 上下文并非全部可用：

![上下文成本构成](/posts/2026/03/claude_images/img_05.jpg)

```text
200K 总上下文
├── 固定开销 (~15-20K)
│   ├── 系统指令: ~2K
│   ├── 所有启用的 Skill 描述符: ~1-5K
│   ├── MCP Server 工具定义: ~10-20K  ← 最大隐形杀手
│   └── LSP 状态: ~2-5K
│
├── 半固定 (~5-10K)
│   ├── CLAUDE.md: ~2-5K
│   └── Memory: ~1-2K
│
└── 动态可用 (~160-180K)
    ├── 对话历史
    ├── 文件内容
    └── 工具调用结果
```

一个典型 MCP Server（如 GitHub）包含 20-30 个工具定义，每个约 200 tokens，合计 4,000-6,000 tokens。接 5 个 Server，光这部分固定开销就到了 25,000 tokens（12.5%）。我第一次算出这个数字的时候，真没想到有这么多，在要读大量代码的场景，这 12.5% 真的很关键。

### 推荐的上下文分层

![上下文分层](/posts/2026/03/claude_images/img_06.jpg)

```text
始终常驻    → CLAUDE.md：项目契约 / 构建命令 / 禁止事项
按路径加载  → rules：语言 / 目录 / 文件类型特定规则
按需加载    → Skills：工作流 / 领域知识
隔离加载    → Subagents：大量探索 / 并行研究
不进上下文  → Hooks：确定性脚本 / 审计 / 阻断
```

说白了，偶尔用的东西就不要每次都加载进来。

### 上下文最佳实践

- 保持 **CLAUDE.md** 短、硬、可执行，优先写命令、约束、架构边界。Anthropic 官方自己的 CLAUDE.md 大约只有 2.5K tokens。
- 把大型参考文档拆到 Skills 的 supporting files，不要塞进 SKILL.md 正文。
- 使用 **.claude/rules/** 做路径/语言规则，不让根 CLAUDE.md 承担所有差异。
- 压缩机制的陷阱：当上下文快满时，Claude Code 会自动进行 Compaction。它是把历史记录做成一个摘要（Summary），原来的详细对话会被删掉。如果你的关键指令（如”不要改这个文件”）藏在对话历史里而不是 CLAUDE.md 里，压缩后规则可能就丢了。

### 压缩后保留什么？（Compact Instructions）

![Compact Instructions](/posts/2026/03/claude_images/img_07.jpg)

你可以在 CLAUDE.md 里显式地告诉 Claude 压缩时必须保留哪些核心状态：

```markdown
# Compact Instructions
When compacting the conversation, always maintain:
1. The original system objective and current progress.
2. Modified files and their key changes.
3. Current verification status (pass/fail).
4. Open TODOs and rollback notes.
5. Tool outputs (can delete, keep pass/fail only).
```

除了写 Compact Instructions，还有一种更主动的方案：在开新会话前，先让 Claude 写一份 **HANDOFF.md**，把当前进度、尝试过什么、哪些走通了、哪些是死路、下一步该做什么写清楚。下一个 Claude 实例只读这个文件就能接着做，不依赖压缩算法的摘要质量。

---

## 4. Skills 设计：不是模板库，是用的时候才加载的工作流

Skill 官方描述是”按需加载的知识与工作流”，描述符常驻上下文，完整内容按需加载，用起来和”保存的 Prompt”差别挺大的。

### 一个好 Skill 应该满足什么

1. **描述要准确：**描述要让模型知道”何时该用我”，而不是”我是干什么的”，这两个差很多。
2. **闭环执行：**有完整步骤、输入、输出和停止条件，别写了个开头没有结尾。
3. **分层加载：**正文只放导航和核心约束，大资料拆到 supporting files 里。
4. **副作用显式声明：**有副作用的 Skill 要显式设置 `disable-model-invocation: true`，不然 Claude 会自己决定要不要跑。

### Skill 怎么做到”按需加载”

Claude Code 团队在内部设计中反复强调 “progressive disclosure”，意思不是让模型一次性看到所有信息，而是先获得索引和导航，再按需拉取细节：

![按需拉取细节](/posts/2026/03/claude_images/img_08.jpg)

- **SKILL.md** 负责定义任务语义、边界和执行骨架。
- **supporting files** 负责提供领域细节。
- **脚本** 负责确定性收集上下文或证据。

一个比较稳定的结构长这样：

```text
.claude/skills/
└── incident-triage/
    ├── SKILL.md
    ├── runbook.md
    ├── examples.md
    └── scripts/
        └── collect-context.sh
```

### Skill 的三种典型类型

#### 类型一：检查清单型（质量门禁）

```yaml
---
name: release-check
description: Use before cutting a release to verify build, version, and smoke test.
---
## Pre-flight (All must pass)
- [ ] `cargo build --release` passes
- [ ] `cargo clippy -- -D warnings` clean
- [ ] Version bumped in Cargo.toml
- [ ] CHANGELOG updated
- [ ] `kaku doctor` passes on clean env
## Output
Pass / Fail per item. Any Fail must be fixed before release.
```

#### 类型二：工作流型（标准化操作）

配置迁移高风险，显式调用 + 内置回滚步骤。

#### 类型三：知识增强型（RAG 替代品）

把特定领域的深度文档（如项目的私有架构设计）喂给 Skill，按需加载。

### 描述符写短点，每个 Skill 都在偷你的上下文空间

由于所有启用的 Skill 的描述符（Description）是常驻上下文的，如果你装了 50 个 Skill，每个描述符 100 字，还没开始说话，你已经丢了 5,000 字的上下文。

**治理原则：**
- 高频（>1 次/会话）→ 保持 auto-invoke，优化描述符。
- 低频（<1 次/会话）→ disable-auto-invoke，手动触发，描述符完全脱离上下文。
- 极低频（<1 次/月）→ 移除 Skill，改为 AGENTS.md 中的文档。

---

## 5. 工具设计：怎么让 Claude 少选错

我后面越用越觉得，给 Claude 的工具和给人写的 API 不是一回事。给人用的 API 往往会追求功能齐全，但给 agent 用，重点不是功能堆得多完整，而是让它更容易用对。

### 好工具 vs 坏工具

![好工具 vs 坏工具](/posts/2026/03/claude_images/img_09.jpg)

| 维度 | 好工具 | 坏工具 |
| :--- | :--- | :--- |
| **名称** | `jira_issue_get`, `sentry_errors_search` | `query`, `fetch`, `do_action` |
| **参数** | `issue_key`, `project_id`, `response_format` | `id`, `name`, `target` |

**工具设计的黄金准则：**

![AskUserQuestion 工具界面](/posts/2026/03/claude_images/img_10.jpg)

![工具设计的黄金准则](/posts/2026/03/claude_images/img_11.jpg)

- **左边（markdown 自由输出）太松**，模型格式随意、外层解析脆弱；
- **右边（ExitPlanTool 参数）太死**，等到退出计划阶段提问已经太晚；
- **AskUserQuestion 独立工具落在中间**，结构化且随时可调用，是这三者里最稳定的设计。

说白了，既然你就是要 Claude 停下来问一句，那就直接给它一个专门的工具。

### 从 Claude Code 内部工具演进学到的

- **Todo 工具的演进：**早期用 TodoWrite 工具 + 每 5 轮插入提醒让 Claude 记住任务。随着模型变强，这个工具反而成了限制。教训：当初加这个工具是因为模型不够强，模型变强之后它反而变成了枷锁。值得过段时间回来检查一下，当初加的限制还成不成立。
- **搜索工具的演进：**最初用 RAG 向量数据库，虽然快但需要索引、不同环境脆弱。现在的趋势是通过 `grep`、`find` 和 `ls -R` 灵活组合，配合 `read_file`。这种”原生命令驱动”的精确度比向量检索高得多。

### 什么时候不该再加 Tool

如果你发现一个需求需要 Claude 连续调用 3 次以上同一个工具才能拿齐数据，那说明你该设计一个更能聚合上下文的 Skill，而不是一个新 Tool。

---

## 6. Hooks：在 Claude 执行操作前后，强制插入你自己的逻辑

Hooks 是 Claude Code 的控制平面出口。它不是 Prompt，而是**拦截逻辑**。

![Hooks 命令](/posts/2026/03/claude_images/img_13.jpg)

### 适合 vs 不适合放到 Hooks 的

- **适合：**阻断修改受保护文件、Edit 后自动格式化/lint/轻量校验、SessionStart 后注入动态上下文（Git 分支、环境变量）、任务完成后推送通知。
- **不适合：**需要读大量上下文的复杂语义判断、长时间运行的业务流程、需要多步推理和权衡的决策。

### Hooks 示例

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "pattern": "*.rs",
        "hooks": [
          {
            "type": "command",
            "command": "cargo check 2>&1 | head -30",
            "statusMessage": "Running cargo check..."
          }
        ]
      }
    ]
  }
}
```

### Hooks：越早发现错误，越省时间

![早发现错误](/posts/2026/03/claude_images/img_14.jpg)

每次编辑完立刻知道有没有编译错误，比”跑了一堆才发现最开始就挂了”舒服得多。

### Hooks + Skills + CLAUDE.md 三层叠加

用下来感觉，三样少任何一层都会有漏洞：
- **CLAUDE.md**：定性，告诉它”你不该动这些”。
- **Skills**：定量，告诉它”你怎么动那些”。
- **Hook**：对关键路径执行硬性校验，必要时阻断。

---

## 7. Subagents：派一个独立的 Claude 去干一件具体的事

Subagent 就是从主对话派出去的一个独立 Claude 实例，有自己的上下文窗口、只用你指定的工具、干完汇报结果。核心价值不是”并行”，而是隔离。

![Subagents 任务结构](/posts/2026/03/claude_images/img_12.jpg)

### 配置时要显式约束

- **tools / disallowedTools**：限定能用什么工具。
- **model**：探索任务用 Haiku/Sonnet，重要审查用 Opus。
- **maxTurns**：防止跑飞。
- **isolation: worktree**：需要动文件时隔离文件系统。

另一个实用细节：长时间运行的 bash 命令可以按 `Ctrl+B` 移到后台，Claude 之后会用 BashOutput 工具查看结果，不会阻塞主线程。

### 几个常见反模式

- 子代理权限和主线程一样宽，隔离没有意义。
- 输出格式不固定，主线程拿到没法用。
- 子任务之间强依赖，频繁要共享中间状态，这种情况用 Subagent 不合适。

---

## 8. Prompt Caching：Claude Code 内部架构的核心

Claude Code 的整个架构都是围绕 Prompt 缓存构建的，高缓存命中率不只降低成本，也帮助创造更宽松的速率限制。

### 为缓存设计的 Prompt Layout

![Prompt Layout](/posts/2026/03/claude_images/img_15.jpg)

1. **始终常驻：**System Prompts、Tool Definitions、Skills。
2. **极少变动：**CLAUDE.md、Memory。
3. **频繁追加：**对话历史（只有末尾会变）。
4. **动态插入：**当前读取的文件内容（最难缓存的部分）。

### 最佳实践

- **会话中途不要切换模型：**切换到 Haiku 实际上比继续用 Opus 更贵，因为要为 Haiku 重建整个缓存。
- **Compaction 的实际实现：**上下文快满时，Claude Code 会开一个 fork 调用，把完整对话历史喂给模型请求摘要，这一步命中缓存只需 1/10 的价格。

![上下文压缩](/posts/2026/03/claude_images/img_16.jpg)

- **defer_loading：**工具的延迟加载。只有当 Claude 显式请求某个新工具或 Skill 时，才将其定义插入到缓存链的后端。

---

## 9. 验证闭环：没有 Verifier 就没有工程上的 Agent

对着那六层框架，验证是最容易被忽略的。

### Verifier 的层级

1. **Syntax level** (Hooks)：`lint`, `format`, `compile`。
2. **Semantic level** (Tests)：`单元测试`, `集成测试`。
3. **State level** (Logging/Tracing)：从 Sentry/Loki 拿运行证据。
4. **Visual level** (Screenshots)：如果是前端，必须截图对比。

### 在 Prompt、Skill 和 CLAUDE.md 中显式定义验证

```markdown
# Verification Requirements
For CSS/UI changes:
- Capture before/after screenshots if visual

Definition of done:
- All tests pass
- Lint passes
- No TODO left behind unless explicitly tracked
```

写任务 Prompt 或 Skill 的时候，最好把验收标准提前说清楚。

---

## 10. 高频命令的工程意义

### 上下文管理

- `/context`：查看 token 占用结构，排查 MCP 和文件读取占比。
- `/clear`：清空会话，同一问题被纠偏两次以上就重来。
- `/compact`：压缩但保留重点。
- `/memory`：确认哪些 CLAUDE.md 真的被加载了。

### 能力与治理

![mcp 设置](/posts/2026/03/claude_images/img_17.jpg)

- `/mcp`：管理 MCP 连接，检查 token 成本。
- `/hooks`：管理 hooks。
- `/permissions`：查看或更新权限白名单。
- `/sandbox`：配置沙箱隔离。
- `/model`：切换模型。

### 会话连续性与并行

- `claude --continue`：恢复当前目录最近会话。
- `claude --resume`：打开选择器恢复历史会话。
- `claude --continue --fork`：从已有会话分叉。
- `claude --worktree`：创建隔离 git worktree。
- `claude -p "prompt"`：非交互模式，接入 CI。

### 几个不常见但很好用的命令

- `/simplify`：对刚改完的代码做三维检查。
- `/rewind`：回到某个会话 checkpoint 重新总结。
- `/btw`：快速问一个侧问题，不打断主任务。
- `/insight`：让 Claude 分析当前会话，提炼出哪些内容值得沉淀到 CLAUDE.md。
- **双击 ESC 回溯**：按两次 ESC 可以回到上一条输入重新编辑。

---

## 11. 如何写一个好的 CLAUDE.md

### 应该放什么

- 怎么 build、怎么 test、怎么跑（最核心）。
- 关键目录结构与模块边界。
- 代码风格和命名约束。
- 那些不明显的环境坑。
- 绝对不能干的事（NEVER 列表）。
- 压缩时必须保留的信息（Compact Instructions）。

### 不该放什么

- 大段背景介绍。
- 完整 API 文档。
- 空泛原则，如”写高质量代码”。
- Claude 通过读仓库即可推断的显然信息。

### 高质量模板

```markdown
# Project Contract

## Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

## Architecture Gaps (Claude cannot guess)
- Path `src/legacy` is deprecated, use `src/core` instead.
- Shared state must go through `SignalStore`.

## Never Do
- Never modify `package-lock.json` manually.
- Never use inline styles.
- Never delete console.log without reason.

## Compact Instructions
When compacting, always retain the current rollback plan and failed test cases.
```

---

## 12. 最近自己折腾中得到的新经验

### “环境透明”比你想象中重要

如果 Claude 不知道你用了哪个版本的 Node，或者不知道你本地的 Port 8080 被占了，它出的脚本大概率会挂在那里。通过 Hooks 在 SessionStart 时注入 `env` 信息是一个极佳的实践。

### 混合语言项目的 Hooks 实践

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "pattern": "*.rs",
        "hooks": [{ "type": "command", "command": "cargo check...", "statusMessage": "Checking Rust..." }]
      },
      {
        "matcher": "Edit",
        "pattern": "*.lua",
        "hooks": [{ "type": "command", "command": "luajit -b $FILE...", "statusMessage": "Checking Lua syntax..." }]
      }
    ]
  }
}
```

### 完整的工程化布局参考

```text
Project/
├── CLAUDE.md
├── .claude/
│   ├── rules/
│   │   ├── core.md
│   │   ├── config.md
│   │   └── release.md
│   ├── skills/
│   │   ├── runtime-diagnosis/
│   │   ├── config-migration/
│   │   ├── release-check/
│   │   └── incident-triage/
│   ├── agents/
│   │   ├── reviewer.md
│   │   └── explorer.md
│   └── settings.json
└── docs/
    └── ai/
        ├── architecture.md
        └── release-runbook.md
```

通过这种布局，全局约束、路径约束、工作流程和架构细节完全解耦。

---

## 13. 常见反模式

![常见反模式](/posts/2026/03/claude_images/img_19.jpg)

- **死磕一个会话**：上下文污染是客观存在的，感觉 Claude 开始”胡言乱语”或不停道歉时，存个 HANDOFF.md 快跑。
- **允许任何文件修改**：某些核心文件（如加密 Key、关键配置）必须在 Hooks 里做 Hard Block。
- **跳过本地验证**：依赖 Claude 的「It should work now」是危险的。

---

## 14. 配置健康检查

我把这套检查整理成了一个开源 Skill 项目：[tw93/claude-health](https://github.com/tw93/claude-health)。

```bash
npx skills add tw93/claude-health
```

手动跑 `/health`，它会自动识别项目复杂度并输出一份优先级报告。

---

## 15. 结语

![智商钟形图隐喻](/posts/2026/03/claude_images/img_18.jpg)

用 Claude Code 大概会经历三个阶段：

![使用体验的三阶段](/posts/2026/03/claude_images/img_20.jpg)

| 阶段 | 关注点 | 效率感知 |
| :--- | :--- | :--- |
| **工具使用者** | “这个功能怎么用” | 有帮助但有限 |
| **流程优化者** | “如何让协作更顺”，开始写 CLAUDE.md 和 Skills | 明显提升 |
| **系统设计者** | “如何让 Agent 在约束下自主运作” | 质变 |

到了第三阶段，关注点会变成「怎么让 agent 在约束下自己跑起来」。假如一个任务你说不清楚「什么叫做完」，那大概率它也不适合直接扔给 Claude 自主完成。

这些是半年折腾下来的一些总结，如果大伙有用得更 6 的技巧，欢迎告诉我。

