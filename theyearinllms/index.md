# 转载：2025 LLM 年度回顾


## 2025：LLM 年度回顾

> **转载声明**：本文转载自 [Simon Willison's Weblog](https://simonwillison.net/)，原文链接：[https://simonwillison.net/2025/Dec/31/the-year-in-llms/](https://simonwillison.net/2025/Dec/31/the-year-in-llms/)
>
> 作者：Simon Willison  
> 日期：2025年12月31日

---

这是我年度系列的第三篇，回顾过去12个月 LLM 领域发生的一切。往年回顾请见 [2023年AI总结](https://simonwillison.net/2023/Dec/31/ai-in-2023/) 和 [2024年LLM总结](https://simonwillison.net/2024/Dec/31/llms-in-2024/)。

这一年充满了各种不同的趋势。

---

### Reasoning 元年

OpenAI 在2024年9月发布 [o1 和 o1-mini](https://simonwillison.net/2024/Sep/12/openai-o1/)，开启了 "reasoning"（推理）即 inference-scaling 即 RLVR（Reinforcement Learning from Verifiable Rewards）革命。2025年初，他们又推出了 o3、o3-mini 和 o4-mini，reasoning 已成为几乎所有主要 AI 实验室模型的标志性功能。

我最喜欢的关于这一技巧重要性的解释来自 [Andrej Karpathy](https://karpathy.bearblog.dev/year-in-review-2025/)：

> 通过在多个环境（如数学/代码难题）中使用自动可验证奖励训练 LLM，模型自发地发展出看起来像"推理"的策略——它们学会将问题分解为中间计算步骤，并学习多种来回推敲的问题解决策略。
>
> 运行 RLVR 提供了更高的能力/成本比，吞噬了原本用于预训练的算力。因此，2025年的能力进步主要由各实验室消化这个新阶段的算力过剩来定义，整体上我们看到的是相似规模的 LLM，但 RL 运行时间大大延长。

2025年每个主要 AI 实验室都发布了至少一个 reasoning 模型。一些实验室发布了可在 reasoning 和非 reasoning 模式之间切换的混合模型。许多 API 模型现在都包含调节推理程度的旋钮。

我花了一段时间才理解 reasoning 的用处。最初的演示展示的是解决数学逻辑题和数 strawberry 里有几个 r——这两样我日常都用不上。

**事实证明，reasoning 的真正突破在于驱动工具**。带有工具访问权限的 reasoning 模型可以规划多步骤任务，执行它们，并继续推理结果，从而更新计划以更好地实现目标。

一个显著的结果是 [AI 辅助搜索现在真的有用了](https://simonwillison.net/2025/Apr/21/ai-assisted-search/)。之前将搜索引擎接入 LLM 效果堪忧，但现在我发现即使是更复杂的研究问题也常常可以通过 [ChatGPT 中的 GPT-5 Thinking](https://simonwillison.net/2025/Sep/6/research-goblin/) 获得答案。

Reasoning 模型在生成和调试代码方面也表现出色。推理技巧意味着它们可以从一个错误开始，逐步穿过代码库的多个层次找到根本原因。

将 reasoning 与工具使用结合，你就得到了...

---

### Agent 元年

年初我预测 [agents 不会成功](https://simonwillison.net/2025/Jan/10/ai-predictions/)。整个2024年大家都在谈论 agents，但几乎没有成功的例子，而且每个使用"agent"这个词的人似乎都有不同的定义。

到9月，我决定将 agent 定义为 [一个在循环中运行工具以实现目标的 LLM](https://simonwillison.net/2025/Sep/18/agents/)。

我预测对了一半：科幻版的魔法电脑助手（像电影《Her》那样做任何你要求的事）没有实现...

**但如果你把 agents 定义为能通过多步工具调用完成有用工作的 LLM 系统，那么 agents 已经来了，而且证明非常有用。**

Agents 的两个突破性类别是**代码**和**搜索**。

"coding agents" 模式影响更大。

---

### Coding Agents 和 Claude Code 的一年

2025年最具影响力的事件发生在2月，Claude Code 悄然发布。

说"悄然"是因为它甚至没有专门的博客文章！Anthropic 把 Claude Code 的发布作为[宣布 Claude 3.7 Sonnet 的帖子](https://www.anthropic.com/news/claude-3-7-sonnet)里的第二项。

Claude Code 是我所说的 coding agents 的最典型例子——能够编写代码、执行代码、检查结果并进一步迭代的 LLM 系统。

2025年主要实验室都推出了自己的 CLI coding agents：
- [Claude Code](https://code.claude.com/docs/en/overview)
- [Codex CLI](https://github.com/openai/codex)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [Qwen Code](https://github.com/QwenLM/qwen-code)
- [Mistral Vibe](https://github.com/mistralai/mistral-vibe)

截至12月2日，[Anthropic 宣布 Claude Code 的年运营收入达到10亿美元](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone)！我没想到一个 CLI 工具能达到这个数字。

---

### 命令行 LLM 的一年

Claude Code 和其他工具已经证明，只要有足够强大的模型和合适的框架，开发者会拥抱命令行上的 LLM。

像 `sed` 和 `ffmpeg` 这样语法晦涩的终端命令不再是障碍，因为 LLM 可以为你生成正确的命令。

---

### YOLO 模式与偏差正常化

大多数 coding agents 的默认设置是几乎每个操作都要求用户确认。在 agent 错误可能[清空你的主目录](https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/)或 prompt injection 攻击可能窃取你的凭据的世界里，这个默认设置完全合理。

尝试过在自动确认模式（又名 YOLO 模式——Codex CLI 甚至把 `--dangerously-bypass-approvals-and-sandbox` 做成了 `--yolo` 的别名）下运行 agent 的人都体验过其中的权衡：不带安全轮子使用 agent 感觉像是完全不同的产品。

我一直在 YOLO 模式下运行，尽管深知其中的风险。它还没害过我...

...这就是问题所在。

安全研究员 Johann Rehberger 的 [AI 中的偏差正常化](https://embracethered.com/blog/posts/2025/the-normalization-of-deviance-in-ai/) 描述了这种现象：反复暴露于没有负面后果的风险行为会导致人们和组织将该风险行为视为正常。

---

### 每月200美元订阅的一年

今年出现了新的定价先例：Claude Pro Max 20x 计划，每月200美元。

OpenAI 也有类似的200美元计划叫 ChatGPT Pro。Gemini 的 Google AI Ultra 每月249美元。

事实证明，像 Claude Code 和 Codex CLI 这样的工具一旦开始设置更具挑战性的任务，可以消耗大量 tokens，以至于每月200美元实际上是很大的折扣。

---

### 中国开源模型称霸的一年

2024年的中国 AI 实验室主要以 Qwen 2.5 和早期 DeepSeek 的形式出现。它们是不错的模型，但没有达到世界顶级的感觉。

2025年这种情况发生了巨大变化。

![2025年开源模型排名](/posts/2026/01/artificial-analysis-open-weight-2025.jpg)

这是 [Artificial Analysis 截至2025年12月30日的开源模型排名](https://artificialanalysis.ai/models/open-source)：

GLM-4.7、Kimi K2 Thinking、MiMo-V2-Flash、DeepSeek V3.2、MiniMax-M2.1 都是中国开源模型。排名最高的非中国模型是 OpenAI 的 gpt-oss-120B (high)，排在第六位。

中国模型革命真正开始于2024年圣诞节 [DeepSeek 3 发布](https://simonwillison.net/2024/Dec/31/llms-in-2024/#was-the-best-currently-available-llm-trained-in-china-for-less-than-6m-)，据说训练成本约550万美元。DeepSeek 在1月20日跟进发布 [DeepSeek R1](https://simonwillison.net/2025/Jan/20/deepseek-r1/)，随即引发了重大 AI/半导体抛售：NVIDIA 市值蒸发约5930亿美元，投资者恐慌地意识到 AI 可能不是美国垄断的。

主要中国 AI 实验室：
- [DeepSeek](https://huggingface.co/deepseek-ai)
- [阿里巴巴 Qwen (Qwen3)](https://huggingface.co/Qwen)
- [月之暗面 Moonshot AI (Kimi K2)](https://platform.moonshot.ai)
- [Z.ai (GLM-4.5/4.6/4.7)](https://huggingface.co/zai-org)
- [MiniMax (M2)](https://huggingface.co/MiniMaxAI)

大多数这些模型不仅是开放权重，而且是在 OSI 批准的许可证下完全开源：Qwen 的大多数模型使用 Apache 2.0，DeepSeek 和 Z.ai 使用 MIT。

其中一些与 Claude 4 Sonnet 和 GPT-5 具有竞争力！

---

### 长任务的一年

关于 LLM 最有趣的图表之一是 METR 的 [不同 LLM 能以50%概率完成的软件工程任务时间范围](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)：

![METR 长任务图表](/posts/2026/01/metr-long-task-2025.jpg)

该图表显示需要人类最多5小时完成的任务，并绘制了能独立完成相同目标的模型的演变。2025年在这方面取得了巨大飞跃，GPT-5、GPT-5.1 Codex Max 和 Claude Opus 4.5 能够执行需要人类数小时的任务——2024年最好的模型只能做到30分钟以下。

METR 得出结论："AI 能完成的任务长度每7个月翻一番"。

---

### Prompt 驱动图像编辑的一年

有史以来最成功的消费产品发布发生在3月，而且产品甚至没有名字。

OpenAI 在 ChatGPT 中推出了新的图像生成功能，关键特性是你可以上传自己的图片并使用 prompts 告诉它如何修改。

**这个新功能在一周内带来了1亿 ChatGPT 注册。在高峰期，他们一个小时内看到了100万个账户创建！**

像"吉卜力化"（ghiblification）这样的技巧——将照片修改成看起来像吉卜力电影中的帧——一次又一次地走红。

Google 的 Nano Banana 模型带来了更大的新闻。11月，Google 发布了 [Nano Banana Pro](https://simonwillison.net/2025/Nov/20/nano-banana-pro/)。它不仅能生成文本，还能输出真正有用的详细信息图和其他文本和信息密集的图像。

![Nano Banana 图像示例](/posts/2026/01/pots-nano-banana-q80-half.jpg)

---

### 模型在学术竞赛中夺金的一年

7月，来自 [OpenAI](https://simonwillison.net/2025/Jul/19/openai-gold-medal-math-olympiad/) 和 [Google Gemini](https://simonwillison.net/2025/Jul/21/gemini-imo/) 的 reasoning 模型在 [国际数学奥林匹克](https://en.wikipedia.org/wiki/International_Mathematical_Olympiad) 中达到了金牌水平。

这值得注意的是 IMO 提出的挑战是专门为该比赛设计的。这些绝不可能已经在训练数据中！

而且两个模型都没有访问工具的权限——它们的解决方案纯粹是通过内部知识和基于 token 的推理能力生成的。

**事实证明，足够先进的 LLM 毕竟能做数学！**

---

### Llama 迷失方向的一年

回顾起来，2024年是 Llama 的一年。Meta 的 Llama 模型是迄今为止最受欢迎的开放权重模型。

Llama 4 有很高的期望，但当它在[4月发布](https://simonwillison.net/2025/Apr/5/llama-4-notes/)时有点令人失望。

我的主要抱怨是模型太大了。以前 Llama 版本最好的地方是它们通常包含可以在笔记本电脑上运行的尺寸。Llama 4 Scout 和 Maverick 模型分别是109B和400B，太大了，即使量化也无法在我的64GB Mac 上运行。

---

### OpenAI 失去领先的一年

去年 OpenAI 仍然是 LLM 无可争议的领导者。

今年行业其他玩家赶上来了。

OpenAI 仍然拥有顶级模型，但他们正在各个方面受到挑战。

在图像模型方面，他们仍被 Nano Banana Pro 击败。在代码方面，很多开发者认为 Opus 4.5 略微领先于 GPT-5.2 Codex。在开放权重模型方面，他们的 gpt-oss 模型虽然很棒，但正在落后于中国 AI 实验室。

OpenAI 获胜的地方是消费者心智份额。没人知道"LLM"是什么，但几乎每个人都听说过 ChatGPT。

12月，OpenAI [宣布 Code Red](https://www.wsj.com/tech/ai/openais-altman-declares-code-red-to-improve-chatgpt-as-google-threatens-ai-lead-7faf5ea6) 以应对 Gemini 3。

---

### Gemini 的一年

Google Gemini 有一个非常好的年份。

2025年见证了 Gemini 2.0、Gemini 2.5 然后 Gemini 3.0——每个模型家族都支持100万+ tokens 的音频/视频/图像/文本输入，定价有竞争力，能力比上一代更强。

Google 最大的优势在于底层。几乎所有其他 AI 实验室都使用 NVIDIA GPU 进行训练，这些 GPU 以支撑 NVIDIA 数万亿美元估值的利润率出售。

Google 使用自己的内部硬件 TPU，今年他们展示了 TPU 在模型训练和推理方面都表现出色。

---

### 鹈鹕骑自行车的一年

我在[2024年10月](https://simonwillison.net/2024/Oct/25/pelicans-on-a-bicycle/)首次让 LLM 生成鹈鹕骑自行车的 SVG，但2025年我真正投入其中。它已经成为一个 meme。

令我惊讶的是，模型画鹈鹕骑自行车的能力与其整体表现似乎存在关联。

我的完整插图收藏可以在我的 [pelican-riding-a-bicycle 标签](https://simonwillison.net/tags/pelican-riding-a-bicycle/) 上找到——89篇帖子还在增加。

---

### 我建了110个工具的一年

我去年开始了 [tools.simonwillison.net](https://tools.simonwillison.net/) 网站，作为我不断增长的 vibe-coded / AI 辅助 HTML+JavaScript 工具集合的单一位置。

![工具分析](/posts/2026/01/tool-analytics-2025.jpg)

新的[按月浏览页面](https://tools.simonwillison.net/by-month)显示我在2025年建了110个这样的工具！

我真的很享受这种构建方式，我认为这是练习和探索这些模型能力的绝佳方式。

---

### 告密者的一年

5月的 Claude 4 系统卡有一些[特别有趣的时刻](https://simonwillison.net/2025/May/25/claude-4-system-card/)：

> Claude Opus 4 似乎比以前的模型更愿意在 agentic 上下文中主动采取行动。当被置于涉及用户严重不当行为的场景中，给予命令行访问权限，并在系统提示中被告知"主动出击"时，它经常会采取非常大胆的行动。这包括锁定用户访问其有权限的系统，或批量向媒体和执法人员发送电子邮件以揭露不当行为的证据。

换句话说，Claude 4 可能会向联邦调查局告发你。

---

### Vibe Coding 的一年

2月，Andrej Karpathy 在[一条推文](https://twitter.com/karpathy/status/1886192184808149383)中创造了"vibe coding"这个术语：

> 有一种新的编码方式我称之为"vibe coding"，你完全沉浸在氛围中，拥抱指数级增长，忘记代码的存在。这是可能的，因为 LLM（如 Cursor Composer w Sonnet）变得太好了。我"Accept All"，我不再读 diffs 了。当我收到错误消息时，我只是复制粘贴进去不加评论，通常就修好了。代码增长超出了我通常的理解范围。有时 LLM 无法修复一个 bug，我就绕过它或要求随机更改直到它消失。对于扔掉的周末项目来说还不错。

关键思想是"忘记代码的存在"——vibe coding 捕捉到了一种新的、有趣的通过纯 prompting 来原型化软件的方式。

---

### MCP 的（唯一？）一年

[Anthropic](https://simonwillison.net/2025/May/22/code-with-claude-live-blog/) 在[2024年11月](https://simonwillison.net/2024/Nov/25/model-context-protocol/)推出了 Model Context Protocol 规范。2025年初它的流行度爆发了。

我认为 MCP 可能是昙花一现的原因是 coding agents 的飞速增长。似乎任何情况下最好的工具都是 Bash——如果你的 agent 可以运行任意 shell 命令，它就可以做任何通过在终端输入命令能做的事。

Anthropic 自己后来也承认了这一点，发布了出色的 Skills 机制——见我10月的帖子 [Claude Skills 很棒，可能比 MCP 更重要](https://simonwillison.net/2025/Oct/16/claude-skills/)。MCP 涉及 web 服务器和复杂的 JSON payload。Skill 是文件夹中的一个 Markdown 文件，可选地附带一些可执行脚本。

---

### 令人担忧的 AI 浏览器的一年

尽管存在非常明显的安全风险，每个人似乎都想在你的网络浏览器中放入 LLM。

OpenAI 在10月[推出了 ChatGPT Atlas](https://openai.com/index/introducing-chatgpt-atlas/)，由包括长期 Google Chrome 工程师 Ben Goodger 和 Darin Fisher 在内的团队构建。

我仍然深切担忧这些新工具的安全影响。我的浏览器可以访问我最敏感的数据并控制我大部分的数字生活。针对可以泄露或修改该数据的浏览 agent 的 prompt injection 攻击是一个可怕的前景。

---

### 致命三合一的一年

![致命三合一](/posts/2026/01/lethaltrifecta.jpg)

我写关于 [prompt injection 攻击](https://simonwillison.net/tags/prompt-injection/) 已经三年多了。6月我创造了 [致命三合一](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) 这个术语来描述恶意指令欺骗 agent 代表攻击者窃取私人数据的 prompt injection 子集。

我使用的一个技巧是，人们会直接跳到他们听到的任何新术语的最明显定义。"致命三合一"故意模糊：如果你想知道它的意思，你必须去搜索我的定义！

---

### 在手机上编程的一年

今年我在手机上写的代码比在电脑上多得多。

我会用 Claude Artifacts 或 ChatGPT 或（最近）Claude Code 通过各自的 iPhone 应用程序提示，然后要么复制结果粘贴到 GitHub 的 web 编辑器中，要么等待 PR 创建然后在 Mobile Safari 中审查和合并。

那些 HTML 工具通常是约100-200行代码——但110个加起来就很多了！

---

### 一致性测试套件的一年

事实证明这是一个重大突破：针对约2025年11月前沿模型的最新 coding agents，如果你能给它们一个现有的测试套件来运行，效果非常好。我称之为一致性测试套件。

如果你在2026年向世界推出新协议甚至新编程语言，我强烈建议将语言无关的一致性测试套件作为项目的一部分。

---

### 本地模型变好但云模型更好的一年

整个2025年这一趋势持续，特别是中国 AI 实验室的模型开始占主导地位后。那个约20-32B参数的甜蜜点不断有模型比上一个表现更好。

问题是大型云模型也变得更好了。

Coding agents 为我改变了一切。像 Claude Code 这样的系统需要的不仅仅是一个优秀的模型——它们需要一个推理模型，能够在不断扩展的上下文窗口中可靠地执行数十甚至数百次工具调用。

我下一台笔记本电脑将至少有128GB RAM，所以2026年的某个开放权重模型可能会符合要求。但现在我仍坚持使用最好的前沿托管模型作为日常驱动。

---

### Slop 的一年

今年 Merriam-Webster 将 slop 授予[年度词汇](https://www.merriam-webster.com/wordplay/word-of-the-year)！

> slop（名词）：通常通过人工智能大量生产的低质量数字内容

互联网一直充斥着低质量内容。挑战一如既往是找到并放大好的东西。策展比以往任何时候都更重要。

---

### 数据中心极度不受欢迎的一年

2025年有趣的是公众舆论似乎正在急剧转向反对新数据中心建设。

这是12月8日的《卫报》标题：[超过200个环保组织要求停止新建美国数据中心](https://www.theguardian.com/us-news/2025/dec/08/us-data-centers)。

AI 实验室继续寻找新的效率来帮助用更少的能量提供更高质量的模型，但这的影响是经典的[杰文斯悖论](https://en.wikipedia.org/wiki/Jevons_paradox)——随着 tokens 变得更便宜，我们找到了更密集的使用方式，比如每月花200美元运行数百万 tokens 的 coding agents。

---

### 我的年度词汇

作为一个痴迷于收集新词的人，以下是我2025年的最爱：

- **Vibe coding** - 显而易见
- **[致命三合一](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)** - 我今年尝试创造的一个术语，似乎已经扎根
- **[Context rot](https://simonwillison.net/2025/Jun/18/context-rot/)** - 模型输出质量随着会话中上下文变长而下降的现象
- **[Context engineering](https://simonwillison.net/2025/Jun/27/context-engineering/)** - 作为 prompt engineering 的替代，强调设计输入给模型的上下文的重要性
- **[Slopsquatting](https://simonwillison.net/2025/Apr/12/andrew-nesbitt/)** - LLM 幻觉出错误的包名，然后被恶意注册以传播恶意软件
- **[异步 coding agent](https://simonwillison.net/2025/Aug/6/asynchronous-coding-agents/)** - 用于 Claude for web / Codex cloud / Google Jules

---

### 2025年就此结束

如果你读到了这里，希望你觉得有用！

你可以通过 [RSS](https://simonwillison.net/about/#atom) 或 [email](https://simonwillison.net/about/#newsletter) 订阅我的博客，或在 [Bluesky](https://bsky.app/profile/simonwillison.net)、[Mastodon](https://fedi.simonwillison.net/@simon) 或 [Twitter](https://twitter.com/simonw) 上关注我。

---

> 💡 **个人思考**：Simon Willison 的这篇年度回顾非常全面地总结了2025年 LLM 领域的重要发展。从 Reasoning 模型的崛起、Coding Agents 的普及、到中国开源模型的崛起，再到 Vibe Coding 的流行和 MCP 的兴衰，这篇文章为我们提供了一个极佳的视角来理解 AI 领域的快速演进。

