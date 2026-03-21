# Claude Code 学习与工程实践资料大全


本文旨在整理与收集全网第一手 [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) 相关的优质学习资料，涵盖官方文档、底层架构原理及在实际工程中的落地应用。

## 🎯 核心必读：架构与工程实践

这些内容深入剖析了 Claude Code 及 Agent 的内部结构、治理方式与开发最佳实践，是高质量的第一手资料：

- **《你不知道的 Claude Code：架构、治理与工程实践》**
  - 聚焦于这套系统架构设计的背后逻辑与具体工程化经验。
  - 🔗 [原文链接](https://x.com/HiTw93/status/2032091246588518683)

- **《你不知道的 Agent：原理、架构与工程实践》**
  - 探讨 Agent 背后的通用底层思想、框架演进及在实际项目开发中的应用闭环。
  - 🔗 [原文链接](https://x.com/HiTw93/status/2034627967926825175)

## 📖 官方文档与基础指南

构建扎实基本功，首选最权威的官方资料与体系化课程：

- **[Claude Code 官方概述与使用文档](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)**
  包含关于快速入门指南、CLI 命令、本地配置方案、网络/代理设置及错误排查等最新资料。

- **[Anthropic Claude Code 功能演示与主页](https://claude.com)**
  官方对 Claude Code 核心功能的介绍、设计理念以及代理编码工具的能力边界和最佳适用场景说明。
- **[Anthropic 官方 YouTube 频道](https://www.youtube.com/@anthropic-ai)**
  官方产品发布、功能讲解与核心技术演示的第一手原片资源阵地。

### 🎓 Anthropic 官方体系化课程 (Skilljar)
官方推出了 [一套针对 Claude 生态的优质打怪升级课程](https://anthropic.skilljar.com/)，从初学者到进阶架构师均可覆盖：

- **Claude 101**：新手入门，了解基础功能与使用边界。
- **Claude Code in Action**：核心实战课，教你如何把 Claude Code 无缝整合进日常开发工作流。
- **Building with the Claude API**：目前最深度的一门主线课，涵盖 84 节内容、近 8 小时视频，全方位详解 RAG、Tool Use 工具调用及前沿 Agent 架构。
- **Introduction to Model Context Protocol**：MCP 入门宝典，手把手教你从零用 Python 编写自己的 MCP 服务端和客户端。
- **Model Context Protocol: Advanced Topics**：探讨 MCP 实战进阶方向及复杂环境配置。
- **Introduction to Agent Skills**：专项指导如何在 Claude Code 中编写并分享团队自定义的指令与工作流（Skill）。
- **Claude with Amazon Bedrock / Google Cloud's Vertex AI**：主流企业级云端平台部署教程。

## 🚀 进阶学习路线与实战教程方向

如果你已经熟悉了基础的环境配置和日常 `claudecode` 问答，不要停留在仅仅当做命令行问答工具上，可以通过以下第一手实战教程及进阶指南，将 AI 打造为真正的核心生产力：

### 1. MCP (Model Context Protocol) 核心实战技巧
MCP 是让 Claude Code 拥有“超网络与跨工具能力”的关键。配置 MCP 后，它可访问您的外部 API 平台、查询线上监控或自动处理 Jira 工单等工作：

- **[Claude Code: Connect to tools via MCP](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/mcp)**：官方的 MCP 使用与管理指南。列举了利用 SQLite、PostgreSQL 及系统命令行集成的标准示例。
- **[Claude Code 如何安装 MCP？图文教程](https://apifox.com/apiskills/claude-code-mcp)**：高质量第一手中文长篇解析。深入探讨了 `HTTP` 与 `Stdio` 传输协议的区别、作用域配置管理（Local/Project/User）及环境变量等高级扩容技巧。
- **Docker MCP 整合与系统进阶集成**：了解如何利用 `Docker MCP Toolkit` 一键跑通并连接 Jira、Slack 或本地应用数据库等超过 300 种预设容器化网关服务，打通整个后端协作流。

### 2. 深入工作流与定制化研发链路
学会编排 Claude Code 与自身团队代码质量要求的完美契合互动，是掌握 AI Agent 辅助开发的必经之路：

- **自定义 Skills 与 Hook 拦截器应用**：将安全检测或代码规范封装成自定义的 `Skills` 工具供 AI 调用，并通过 `Hooks` 拦截命令在 Git Commit 前自动进行高准确度的智能分段式 Review。
- **从 0 到 1 的 TDD 与自动化重构演练**：社区大量推崇的实战使用形式，教你如何利用大上下文容量让 Claude Code 顺藤摸瓜分析遗留架构，补充历史代码单元测试并无缝执行重构。强烈推荐以下实战参考（包含各大博主的精彩演示）：
  - 📺 **[B站实战演练] [Claude Code 重构大师与单元测试全指南](https://search.bilibili.com/all?keyword=Claude+Code+%E9%87%8D%E6%9E%84+%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95)**：国内平台优质 UP 主演示如何利用 Claude Code 分析项目“代码坏味道”，并全自动生成完整的 Jest/PyTest 单元测试流程。
  - 📺 **[YouTube 核心实操] [How to use Claude Code to refactor applications](https://www.youtube.com/results?search_query=Claude+Code+refactor+applications)**：外网极高播放量的高级开发工作流（Senior Workflow），全程展示如何零人工敲代码完成大型客户端遗留类的拆解和安全重构。
  - 📺 **[YouTube 十全大补教程] [Claude Code 从0到1全攻略](https://www.youtube.com/watch?v=AT4b9kLtQCQ)**：硬核且全面的技术解析视音频。手把手带你深入浅出地跑通 MCP、SubAgent 分治、指令管理、Hook 鉴权及上下文处理等一系列进阶开发环节。

> *本篇优质核心教程将随社区及版本迭代持续更新。如果你也在重度实践 Claude Code，或者编写了自己顺手好用的 MCP 与 Tool，欢迎留言分享你的心得体验！*

