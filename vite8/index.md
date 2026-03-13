# Vite 8.0 稳定版发布！由 Rolldown 提供动力


# Vite 8.0 发布了！

**2026年3月12日**

我们非常高兴地宣布 Vite 8 的稳定版本正式发布！当 Vite 首次推出时，我们在打包工具上做了一个务实的押注：在开发期间使用 esbuild 以求速度，在生产环境使用 Rollup 进行构建优化。这个押注在过去几年里非常成功，我们非常感谢 Rollup 和 esbuild 的维护者。没有他们，Vite 就不会取得如今的成功。

而今天，它融合为了一个整体：**Vite 8 搭载 [Rolldown](https://rolldown.rs/) 作为其单一的、统一的、基于 Rust 的打包工具**，在提供高达 10-30 倍的构建速度的同时，保持了完整的插件兼容性。这是自 Vite 2 以来最重大的架构变更。

Vite 目前每周的下载量已达到 6500 万次，随着每次发布，其生态系统仍在不断增长。为了帮助开发者在不断扩张的插件库中导航，我们还推出了 [registry.vite.dev](https://registry.vite.dev) —— 一个为 Vite、Rolldown 和 Rollup 提供插件搜索的目录，每天从 npm 收集插件数据。

**快速链接：**
- [官方文档](https://vite.dev/)
- 翻译版本：[简体中文](https://cn.vite.dev/) | [日本語](https://ja.vite.dev/) | [Español](https://es.vite.dev/) 等
- [迁移指南](https://vite.dev/guide/migration)
- [GitHub 更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

使用 [vite.new](https://vite.new) 在线体验 Vite 8，或者使用你喜欢的框架通过运行 `pnpm create vite` 在本地搭建 Vite 应用。有关更多信息，请查阅[入门指南](https://vite.dev/guide/)。

```bash
pnpm create vite
```

我们邀请你帮助我们改进 Vite，不论是加入拥有 1200+ 贡献者的 Vite Core 团队，还是为生态中的依赖和插件做出贡献。你可以通过查阅[贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)了解更多。想要获取最新动态，请在 Bluesky、X 或 Mastodon 上关注我们。

## 搭载 Rolldown 的 Vite

### 痛点

从最早的版本开始，Vite 就依赖于两个不同的打包工具来满足不同的需求。[esbuild](https://esbuild.github.io/) 处理开发期间的快速编译（依赖预构建和 TypeScript/JSX 转换），让开发体验感觉在瞬间完成；[Rollup](https://rollupjs.org/) 则处理生产环境的打包、分块和优化，利用它丰富的插件 API 驱动整个 Vite 插件生态。

这种双打包工具的方法在过去几年里运作良好。它让我们更注重开发体验和编排调度，而无需从零开始重新发明解析和打包。但这也带来了权衡。**两条独立的转换流水线意味着有两套独立的插件系统，并且需要越来越多的“胶水代码”来保持这两套流水线的同步。** 随着时间推移，在模块处理方面出现不一致的边缘情况日益积累，针对其中哪一条管道的对齐修复，都可能在另一条管道中引入差异。

### 解决方案

[Rolldown](https://rolldown.rs/) 是由 [VoidZero](https://voidzero.dev/) 团队基于 Rust 构建的打包工具，正是为了迎面解决这些挑战。它的设计有三个目标：
- **性能**：使用 Rust 编写，Rolldown 能够提供原生级别的速度。在基准测试中，它比 Rollup [快 10-30 倍](https://github.com/rolldown/benchmarks) ，达到与 esbuild 相当的性能水平。
- **兼容性**：Rolldown 原生支持与 Rollup 和 Vite 相同的插件 API。大多数现有的 Vite 插件可以在 Vite 8 中开箱即用。
- **高级特性**：单一的统一打包工具能够解锁此前双打包器设置下难以甚至无法实现的功能，包括全量打包模式 (full bundle mode)、更灵活的 chunk 拆分、模块级的持久化缓存以及对 Module Federation 的支持。

### 走向稳定之路

向 Rolldown 的迁移是经过深思熟虑且由社区驱动的。首先，作为技术预览，发布了独立的 `rolldown-vite` 核心包，让早期采用者可以在不影响稳定版本 Vite 的前提下测试 Rolldown 的集成。我们获得了非常宝贵的反馈情况。用户们推动该集成在各种规模和形式的真实代码库中运行，这使我们在广泛发布前能够提前发现边缘案例与兼容性问题。

在 2025 年 12 月，我们发布了完整集成 Rolldown 的 Vite 8 Beta 版。在测试期间，Rolldown 本身在 Vite 社区的测试反馈驱动下，也从 beta 阶段步入了候选发布（RC）阶段。

### 实际性能表现

在 `rolldown-vite` 的预览及 Beta 阶段，几家公司都实测报告了显著的生产环境构建时间缩短：

- **Linear**：生产构建时间从 46s 下降到 6s
- **Ramp**：构建时间缩短了 57%
- **Mercedes-Benz.io**：构建时间缩短最高达 38%
- **Beehiiv**：构建时间缩短了 64%

对于大型项目而言，这种性能提升尤其明显，随着 Rolldown 的持续进化，构建速度有望得到进一步提高。

## 统一的工具链

随着 Vite 8 的发布，Vite 成为一个端到端工具链的入口，该工具链由紧密协作的团队负责打造：构建工具 (Vite)、打包工具 (Rolldown) 以及编译器 ([Oxc](https://oxc.rs/))。这种架构对齐保证了在解析、依赖路由、转换以及代码压缩等整个技术栈上的行为一致性。这也意味着随着 JavaScript 语言规范的发展，我们可以快速采用新规范。并且由于各层之间的深度整合，我们可以实现之前遥不可及的优化，例如利用 Oxc 的语义分析在 Rolldown 中实现更好的 Tree-shaking 效果。

### 感谢社区

如果没有更广泛社区的支持，这一切都不可能。我们要向多个框架团队再次表达深深的感谢（SvelteKit, React Router, Storybook, Astro, Nuxt 等等）他们在早期测试了 `rolldown-vite`，同时提交了详细的 bug 报告，并帮助我们解决了兼容性问题。我们同样感谢每一位尝试过 Beta 版并分享构建速度提升体验的开发者。

## Node.js 支持

Vite 8 需要 Node.js 20.19+ 或 22.12+ 运行环境，这与 Vite 7 的要求是一致的。此版本要求确保了 Node.js 无需添加额外 flag 标记即可支持 `require(esm)` ，使得 Vite 可以只发布为 ESM 格式。

## 额外新特性

除了集成 Rolldown 之外，Vite 8 还包含了几个值得注意的新特点：

- **集成的 Devtools**：Vite 8 随带 `devtools` 选项来开启 [Vite Devtools](https://devtools.vite.dev/) ，它是一个用于调试和分析的开发者工具，能够带给 Vite 驱动的项目更深度的技术洞察。
- **内置的 tsconfig 路径支持**：开发者现在可以通过配置 `resolve.tsconfigPaths` 为 `true` 来启用 TypeScript 的预设别名路径解析，该功能默认关闭。
- **emitDecoratorMetadata 支持**：Vite 8 如今内建了对 TypeScript `emitDecoratorMetadata` 选项的自动支持，移除对外部插件的需求。
- **Wasm SSR 支持**：`.wasm?init` 导入目前在服务端渲染环境（SSR）也能够正常工作了。
- **浏览器终端转发控制台**：Vite 8 能够将浏览器的控制台日志与错误输出，转发到开发服务器终端界面中。这在搭配基于 AI 编程 agent 工具时非常有效，因为客户端运行时的崩溃在终端 CLI 中将一目了然。你可以通过 `server.forwardConsole` 开启它。

## `@vitejs/plugin-react` v6 发布

伴随着 Vite 8 的发布，我们也释出了 `@vitejs/plugin-react` v6 版本。此插件如今使用 **Oxc** 用于 React 热更新（Fast Refresh）的代码转换。它不再依赖 Babel，同时安装体积也大幅减小。

对于需要使用 [React Compiler](https://react.dev/learn/react-compiler) 的项目，v6 版本提供了 `reactCompilerPreset` 的帮助工具以继续搭配 `@rolldown/plugin-babel` 运作，并在不影响默认设置的情况提供显示的选入路径。

*(注意：v5 版本插件依旧与 Vite 8 兼容可以在先升级 Vite 后再升级该插件)*

## 展望未来与迁移

### 展望未来

Rolldown 整合为架构提升打开了新大门。以下是团队接下来在重点推进的工作：
- **全量打包模式 (Full Bundle Mode，实验性)**：在开发过程中像生产构建一样打包所有的模块。初步的结果展示了 Dev 服务器具备 3倍快的冷启动、快 40% 的全量热重载 以及 减少 10 倍的网络请求数量。当大型项目达到未打包的上限时，这一特性会尤其受用。
- **原生 AST 传输 (Raw AST transfer)**：允许 JavaScript 侧的插件极其廉价地获取用 Rust 构建出的 AST 对象。
- **原生的 MagicString 代码操作**：允许在 JavaScript 中编写自定义转换逻辑，将底层繁重的字符串运算留归 Rust 层处理。
- **稳定环境变量 API**：我们正在努力巩固并稳定最新的运行时 Environment API。生态体系的大佬们已经开始了有规模的周会讨论来进行深度合作。

### 迁移到 Vite 8

对于绝大数项目，升级至 Vite 8 将是一个平滑的过程。我们建设了一个底层的兼容层处理（将 `esbuild` 与 `rollupOptions` 配置自动转换至等价的 Rolldown / Oxc 配置），所以不用改任何代码即可兼容使用。

对于更大型/较繁重的项目而言，我们强烈推荐使用渐进升级策略。首先，你可以使用 Vite 7 但修改依赖将打包器隔离到 `rolldown-vite` 来率先测试它相关的特性，以此排查故障是否因换了底座所导致；随后再逐步整体升级到 Vite 8 大版本中。

在开始前请一定要阅读 [迁移指南 (Migration Guide)](https://vite.dev/guide/migration)。

## 致谢 Rollup 与 esbuild 

伴随 Vite 更迭至 Rolldown 版本之际，我们同样想要向支撑起 Vite 起步的这两大项目深表感谢。

**Rollup** 更是从头到尾担起了 Vite 线上发布流水的支柱重任，它优雅的插件 API 设计深深证明了自身：不仅被后起之秀 Rolldown 完美“继承”，这也是整个 Vite 生态能够爆发茁壮成长的重要基石。Rollup 过硬的代码架构质量决定了我们在考虑扩展性上的高度。感谢创始人 Rich Harris，同时也非常感谢 Rollup 的维护者 Lukas Taegert-Atkinson 以及整个核心团队能够打造一个如此改变了 Web 全球工具链发展轨迹的开源巨石。

**esbuild** 则在那些 Vite 早期的高效开发模式中充当了绝对的推进器 —— 几毫秒内即可完成模块预绑定、以及 TS / JSX 代码编译转化。esbuild 确切地证明了构建工具是完全可以取得数量级的质的拔高，它那飞一般的速度表现为一整代后起之秀的 Rust 和 Go 基建留下了标杆性的高度门槛。感谢作者 Evan Wallace 展示了技术的无限可能。

没有这两个工具就不会有今日所见的 Vite 。即便我们即将切换底座奔向 Rolldown，但它们的设计基因依然深埋在 Vite 中并为我们的生态系统持续供给营养，详情可在 [感谢名单](https://vite.dev/acknowledgements) 中查看更多。

---

*Vite 8 的发布是由 sapphi-red、Vite 团队、上游与下游海量广泛的社区朋友和代码作者共同构筑的。最后感谢 Rolldown 团队的紧密无间的努力！*

