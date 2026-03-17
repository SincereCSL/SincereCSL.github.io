# Announcing Vite+ Alpha 🚀（发布 Vite+ Alpha）


# 发布 Vite+ Alpha (Announcing Vite+ Alpha)

我们很高兴能在 MIT 协议下[开源](https://github.com/voidzero-dev/vite-plus) Vite+。Vite+ 是一个全新的统一工具链和 Web 应用开发入口，它可以管理你的运行时、包管理器以及前端工具链。今天就来试试吧！

## 什么是 Vite+？

[[Vite](https://vite.dev/)+](https://viteplus.dev) 将 Vite、[Vitest](https://vitest.dev/)、[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)、[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)、[Rolldown](https://rolldown.rs/) 和 [tsdown](https://tsdown.dev/) 结合成一个单一的统一 Web 开发工具链，用于开发、测试、linting、格式化，以及生产环境构建，并由我们全新的任务运行器 [Vite Task](https://github.com/voidzero-dev/vite-task) 进行驱动。由于 Web 开发需要诸如 Node.js 这样的运行时和包管理器，Vite+ 也可以覆盖完整的本地开发周期，自动为你管理它们。

使用 Vite+，Web 开发将变得更简单、更快速、更轻量：

- `vp env`：全局或按项目管理 Node.js
- `vp install`：自动使用正确的包管理器安装依赖
- `vp dev`：使用 Vite 提供原生 ES 模块和即时 HMR 的极速开发体验
- `vp check`：使用 Oxlint 进行代码检查，使用 Oxfmt 格式化代码，并用 [tsgo](https://github.com/microsoft/typescript-go) 进行类型检查
- `vp test`：无缝集成并运行 Vitest 进行快速反馈循环测试
- `vp build`：使用 Rolldown 和 Oxc 生成优化的生产环境构建
- `vp run`：执行拥有自动缓存和依赖解析的 monorepo 任务
- `vp pack`：打包库文件以便发布到 npm，或创建独立的应用二进制文件
- `vp create`：使用推荐配置搭建新项目和 monorepo

所有这些命令可以开箱即用地无缝协同工作，只需在项目根目录提供一个配置文件，并且兼容 Vite 生态系统中的所有框架，如 React、Vue、Svelte，或基于 Vite 构建的元框架。

## 性能与扩展性

Vite+ 旨在随着代码库的增长而扩展，同时将你的开发工具缩减为单一依赖项。通过利用 VoidZero 基于 Rust 的 JavaScript 工具链技术，与工具链的每一次交互都变得明显更快且更具扩展性：

- Vite + Rolldown：相比 Vite 7，[生产构建速度提升约 1.6 倍至 7.7 倍](https://vite.dev/blog/announcing-vite8-beta#how-vite-migrated-to-rolldown)
- Oxlint（兼容 ESLint 的 linter）：[比 ESLint 快约 50 倍至 100 倍](https://github.com/oxc-project/bench-linter)
- Oxfmt（兼容 Prettier 的 formatter）：[比 Prettier 快高达 30 倍](https://github.com/oxc-project/bench-formatter)

## 快速开始

可以通过运行以下命令全局安装 `vp`：

```bash
npm install -g vite-plus
```

### macOS / Linux

```bash
curl -fsSL https://vite.plus | bash
```

### Windows (PowerShell)

```powershell
irm https://vite.plus/ps1 | iex
```

### CI 环境

如果在 CI 环境中，请使用 [setup-vp GitHub Action](https://github.com/voidzero-dev/setup-vp)。

安装 Vite+ 后，打开一个新的终端会话，运行 `vp help`，并[查看我们的文档](https://viteplus.dev/guide/)。

## 使用 Vite+

要开始进行 Web 开发，你需要一个 JavaScript 运行时、一个包管理器和许多其他工具。近年来，配置文件不断增多，技术栈各个层面的复杂性也在不断提高。

我们创建 Vite+ 的核心目标之一正是简化 Web 开发流程：你只需 `vp` 和项目根目录下的 `vite.config.ts` 文件，即可在一个地方配置每个工具。这是使用了 Vite+ 之后的开发流程：

1. 首先通过 `vp create`，交互式地创建一个新项目、monorepo 或是单一应用。新项目立即可用，甚至包含 pre-commit 钩子！
2. 运行 `vp install` 以安装 JavaScript 依赖。该命令可委托给你选择的包管理器（推荐使用默认的 [pnpm](https://pnpm.io/)）。
3. 使用 `vp dev` 启动 Vite 开发服务器。
4. 当你完成代码修改时，运行 `vp check` 即可一步到位进行类型检查、代码检查和格式化。运行 `vp check --fix` 可以自动修复格式错误和 linting 问题（小贴士：运行 `vp prepare` 可安装 Vite+ 的 pre-commit 钩子！）。
5. 运行 `vp test` 执行 JavaScript 测试框架。
6. 使用 `vp build` 为项目构建生产环境产物。
7. 通过 `vp run <name>` 结合 Vite Task 执行 `package.json` 里的脚本命令；通过 `vp exec <name>` 运行本地 Package 中的二进制内容。试试 `vpx <name>` 运行本地与远程包二进制文件！
8. 根据你的 `.node-version` 或 `package.json` 中的信息，自动选用对应的 Node.js 版本及包管理方案。

一致 CLI 界面的单一二进制文件使入门变得更加容易，迭代速度更快，并且无论对人类还是 AI 都更简单直接。再也无需处理各种 Node.js 版本管理器、繁杂的包管理器、海量的单个工具及它们的配置文件——或是应对它们的复杂升级过程。

## Vite Task

Vite Task 是一由官方开发的大型[开源项目](https://github.com/voidzero-dev/vite-task)，随附于 Vite+ 中交付使用。它为 Vite+ 内置命令和可通过 `vp run` 调用的 `package.json` 脚本任务充当核心任务运行器。Vite Task 在工作区组件之间建立任务编排策略：

- 自动化输入跟踪：Vite Task自动对命令使用的输入文件进行指纹识别，以在没有手动配置时决定本地缓存的内容。如果没有任何改变，它会跳过该任务并重放缓存结果。
- 依赖项感知执行：任务将基于你的 `package.json` 依赖项图谱和显式的 `dependsOn` 声明按正确顺序执行。类似于 `tsc && vp build` 等包含多指令的脚本将拆分为各自独立可缓存的任务单元。
- 熟悉的接口：`vp run` 反映了 [pnpm run](https://pnpm.io/cli/run) 接口，包括对其 monorepo 环境支持，这降低了接纳熟悉 Vite+ 的新认知学习负担。

对于极其简单并不涉及诸如环境变量等外部输入状态相关的脚本，您只需用 `vp run --cache <script>` 就可以进行运行和启用结果被缓存的特性了。自定义构建缓存控制配置可通过 `vite.config.ts` 文件编写：

```typescript
export default defineConfig({
  run: {
    tasks: {
      'generate:icons': {
        command: 'node scripts/generate-icons.js',
        cache: true, // 默认开启 Caching，设置 false 取消。
        envs: ['ICON_THEME'],
      },
    },
  },
})
```

执行 `vp run generate:icons` 首次执行时会生成输出文件。如果是随后不变的无改变状态重新再调用的话系统会果断将本次略去忽略重放报告！如更改了源代码内容参数，亦或者 `ICON_THEME` 等值改变则任务就会当即重新执行。探索这部分更加详实的使用技巧可以直接翻阅 [Vite Task 官方文档](https://viteplus.dev/vite/guide/)。

## 将项目迁移至 Vite+

不论当前项目是仅在使用 Vite 还是采用诸多 VoidZero 推出的套件，将其改造接入适配并迁移至 Vite+ 的流程都是顺滑且一触即达的过程。尽管 `vp` 充当在设备内部是扮演接入调用操作中心的身份，但也必须在项目内加入安装并引入 `vite-plus` 为其包组依赖以确保命令能够覆盖调用各个附属组件。建议先考虑把项目的底层版本推向演进，比如先把项目换代升级到 Vite 8 并体验其中效益。

如果决定好了一切那么：在您的项目目录直接运行发起命令输入：`vp migrate` 即可，或者是直接就把下段迁移辅助提示话语发送给辅助编程的 AI 去协助达成执行该操作流程：

> Migrate this project to Vite+. Run vp help to understand Vite+’s capabilities. Migrations can be run using vp migrate. Run vp help migrate for options. After the migration, verify the changes and make sure that type checking, linting, formatting, and tests pass. High-five your human when you are done.

如果正使用 ESLint 或 Prettier 等依赖并有意将其项目里全面迁移更换合并使用 [Oxlint](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint) 及配合 [Oxfmt](https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier.html)，十分建议先仔细阅读两套工具自带的迁移说明书以便进行更精准妥善的执行转换动作。

## MIT 协议许可

我们在最初讨论是否推出 Vite+ 时，确实有考虑对企业实施相应的许可计划（[详见预发布博客](https://voidzero.dev/posts/announcing-vite-plus#licensing)）。经过讨论和听从反馈以后，我们认识到一个重点前提：唯独当真正处于毫无条件束缚并且完全免费公开的情况下及彻底作为开放包容的生态体系，才可以实现达到我们将开发人员从重负挣扎中彻底释放出的这一终极目标，并让他们获得更高的工作效益。关于对哪些特性收费的讨论并没能给社区那些已经享受开源与热爱其氛围带去过任何的益处，反而徒增摩擦。这让我们彻底决定：[在基础且通用的 MIT 开源规范下，我们对整个 Vite+ 项目涉及的所有代码都全免开源了](https://github.com/voidzero-dev/vite-plus/blob/main/LICENSE)。

如果欲探讨关于其后续怎样进行维持业务持续运转等话题的话：不妨亲身关注并访问 [Step into the Void](https://void.cloud/) 平台！

## 后续的发展

目前公布释出的初期版本里面，不仅带着 Vite 8，且还有着如：Vitest 4.1、Oxlint 1.52、甚至最新的测试版本 Oxfmt beta 等。我们随着接下来的各项测试对它本身的各项基础等进行成熟化，同时继续加增各类奇妙强大的模块功能。非常期盼各位开发同仁能反馈交流真实的使用心得及各类意见反馈跟真知看法。

链接互通：
- Discord：邀请至 [Step into the Void 社区 Discord 服务器](https://discord.gg/cAnsqHh5PX) 畅谈技术真知。
- GitHub 阵地：[给仓开源库送上您的 Star，与我们聊聊各种小错误或者是日常探讨。](https://github.com/voidzero-dev/vite-plus)
- 参与进来贡献：[阅读参考文档中的贡献说明并递上你的 Pull Requests 吧](https://github.com/voidzero-dev/vite-plus/blob/main/CONTRIBUTING.md)。
- X / [Bluesky](https://bsky.app/profile/voidzero.dev)：来订阅获得这整个关于 [推特在 X 内关注掌握接受关于 VoidZero 的即时发布的新闻和通知](https://x.com/voidzerodev)及其它信息。
- 想第一时间收到资讯：你可以通过 [注册 VoidZero 的新闻信功能通讯渠道去掌握各种发布公告跟快讯等内容防止漏报](https://voidzero.dev/newsletter)。

