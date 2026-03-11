# OpenClaw相关学习资料汇总🦞

## 什么是 OpenClaw？

**OpenClaw**（曾用名 Clawdbot、Moltbot）🦞是一款免费且开源的自主人工智能智能体（AI Agent），由 Peter Steinberger 等人开发。它能够作为自托管网关，将 WhatsApp、Telegram、Discord 和 iMessage 等通讯应用连接到如 Claude、DeepSeek、OpenAI GPT 等大型语言模型，让用户可以在各种消息平台上与个人 AI 助手进行交互。

OpenClaw 可以在用户本地设备上运行，不仅保障了数据隐私与控制权，还能通过其支持的“AgentSkills”自动化执行任务、管理本地文件等操作。项目自发布后迅速走红，在 GitHub 上以极快的速度获得了超过 25 万个 Star ⭐️。因其项目标志为一只龙虾，在国内常被受众亲切地称为「龙虾」。

- **GitHub 代码库**: [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
- **官方网站**: [https://openclaw.ai](https://openclaw.ai)

## 官方与核心资料

- [OpenClaw 官方 GitHub 代码库](https://github.com/openclaw/openclaw) (⭐ 超 250k Stars)
- [OpenClaw 官方网站](https://openclaw.ai)
- [OpenClaw Wikipedia 介绍页面](https://en.wikipedia.org/wiki/OpenClaw)
- [DigitalOcean: How to use OpenClaw AI Agent](https://www.digitalocean.com/)

## 社区高质量学习资料汇总

- [Learn OpenClaw](https://learnopenclaw.com/)
- [OpenClaw橙皮书：从入门到精通](https://my.feishu.cn/wiki/H27Iw9ussiaYbokymhncExtjnAh)
- [OpenClaw 教程](https://openclaw.xlearnity.ai)
- [OpenClaw 能干什么？一个重度用户的 10 个真实用例拆解](https://x.com/yanhua1010/status/2025069629123781031)
- [OpenClaw 从新手到中级完整教程](https://x.com/stark_nico99/status/2026235176150581282)
- [保姆级教程：带你组建第一支龙虾军团](https://x.com/bozhou_ai/status/2029482370605494464)
- [我用 OpenClaw 搭了一套 5 角色 AI 协作操作系统，来个完整的技术拆解！！！](https://x.com/gkxspace/status/2024093343118950463?s=46)
- [呕心沥血肝出来的，奉献给你们的龙虾了：OpenClaw Agent System Prompt 架构详解（9层）](https://x.com/servasyy_ai/status/2029489020208848966)

## 相关应用对接 OpenClaw 教程/通道

OpenClaw 作为一个强大的 AI 网关，可以轻松对接到各类主流通讯软件和平台中。以下是一些常见平台的接入方案或聚合入口：

- **国内主流社交协同平台**:
  - **QQ**: 官方提供 [OpenClaw 专属接入通道](https://q.qq.com/qqbot/openclaw/login.html)
  - **微信 (WeChat)**: 官方提供 [微信管家接入通道](https://claw.guanjia.qq.com) / 个人微信可使用第三方开源插件 [OpenClawWeChat](https://github.com/OpenClawWeChat)（免配置、防封）
  - **企业微信 (WeCom)**: 支持企业自建应用长连接对接，也可安装 `@wecom/wecom-openclaw-plugin` 插件
  - **钉钉 (DingTalk)**: 提供专门的连接器插件 [dingtalk-moltbot-connector](https://github.com/DingTalk-Real-AI/dingtalk-moltbot-connector) 进行无缝接入（需配置 Stream 模式机器任）
  - **飞书 (Feishu)**: 通过配置企业自建应用与启用机器人长连接事件订阅完成对接（无需公网 IP 和回调地址）

- **国际主流通讯平台** (OpenClaw 原生内置支持):
  - **Telegram**: 直接通过 `@BotFather` 创建 Bot，并在 OpenClaw 中配置接入 API Token 即可打通
  - **Discord**: 在 Discord Developer Portal 创建 Bot，开启 Message Content Intent 权限即可使用
  - **Slack**: 支持通过 App Token 与 Bot Token 组合 Socket Mode，原生连通整个工作区
  - **WhatsApp** / **iMessage**: 原生提供相应桥接配置方案

