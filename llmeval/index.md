# 大模型测试评分网站


不同评测站测的不是同一件事：有的测「人更喜欢哪段回答」，有的测标准答案，有的测能不能改真实代码，有的测性价比。同一模型在不同榜上名次差一截，很常见。

看榜时优先问三件事：测的是什么、题会不会已被训练过、方法和结果能不能核对。题目会换新、有标准答案或可执行验证、方法公开的，通常更客观。

---

## 国际综合榜

*   **Arena**（原 LMSYS Chatbot Arena）
    *   **官网**: [https://arena.ai](https://arena.ai)
    *   **Leaderboard Overview**: [https://arena.ai/leaderboard/agent/overall](https://arena.ai/leaderboard/agent/overall)
    *   **介绍**: 引用最广的人类偏好榜。两个匿名模型对同一提示作答，用户投票后按 Elo 排名。测的是好不好用，不是对不对；公司化后向厂商卖评测，独立性有争议。
*   **Artificial Analysis**
    *   **官网**: [https://artificialanalysis.ai](https://artificialanalysis.ai)
    *   **介绍**: 把能力、价格、速度放在一张表里，适合选 API。综合分有权重，名次会随权重变动。
*   **LiveBench**
    *   **官网**: [https://livebench.ai](https://livebench.ai)
    *   **介绍**: 每月换题，用标准答案打分，不用 LLM 当评委。抗刷榜做得比较彻底，但不测文笔和聊天手感。
*   **Stanford HELM**
    *   **官网**: [https://crfm.stanford.edu/helm](https://crfm.stanford.edu/helm)
    *   **介绍**: 斯坦福的多场景、多指标评测，论文和代码公开，可复现。更新慢，不适合天天刷第一名。
*   **Scale SEAL**
    *   **官网**: [https://scale.com/leaderboard](https://scale.com/leaderboard)
    *   **介绍**: 私有题 + 专家打分，防背题有帮助；Scale 与厂商有商业往来，不宜单独当裁判。

---

## 中文评测站

*   **OpenCompass / CompassRank**
    *   **官网**: [https://rank.opencompass.org.cn](https://rank.opencompass.org.cn)
    *   **介绍**: 上海 AI Lab 主导，评测代码开源，中英文都覆盖。国内方法透明度最高的一档。
*   **SuperCLUE**
    *   **官网**: [https://www.superclueai.com](https://www.superclueai.com)
    *   **介绍**: 偏中文产品和 Agent 场景，国内外模型都测。复现门槛高于 OpenCompass，适合看趋势。
*   **FlagEval（天秤）**
    *   **官网**: [https://flageval.baai.ac.cn](https://flageval.baai.ac.cn)
    *   **介绍**: 智源的评测平台，覆盖语言、视觉、音频和多模态。偏研究向，语言能力建议和 OpenCompass 对照。

---

## 代码与工具

*   **SWE-bench**
    *   **官网**: [https://www.swebench.com](https://www.swebench.com)
    *   **介绍**: 用真实 GitHub issue 测能不能提交可工作的补丁。分数受 Agent 框架和预算影响，比较时要对齐设置。
*   **LiveCodeBench**
    *   **官网**: [https://livecodebench.github.io](https://livecodebench.github.io)
    *   **介绍**: 只用训练截止日期之后的竞赛新题，专门抓「背过题」的模型。
*   **Aider**
    *   **官网**: [https://aider.chat/docs/leaderboards](https://aider.chat/docs/leaderboards)
    *   **介绍**: 在真实改代码循环里测通过率和成本，贴近编辑器工作流。
*   **OpenRouter Rankings**
    *   **官网**: [https://openrouter.ai/rankings](https://openrouter.ai/rankings)
    *   **介绍**: 按真实调用量排序，看的是谁在被用，不是谁最强。

---

## 哪些更公正、客观

| 更客观 | 常用但需交叉看 | 不太适合再拿来分高下 |
| --- | --- | --- |
| LiveBench、LiveCodeBench、HELM、OpenCompass | Arena、Artificial Analysis、SuperCLUE、Scale SEAL | MMLU、GSM8K、HumanEval；HF Open LLM Leaderboard 已于 2025 年停更 |

只记两个锚点：**LiveBench 看综合客观能力，LiveCodeBench 或 SWE-bench 看代码。** 做中文产品再加 **OpenCompass**。

按目的选站即可：聊天看 Arena；选 API 看 Artificial Analysis；防背题看 LiveBench；改仓库看 SWE-bench；中文看 OpenCompass。前几名分数接近时，名次差多半是噪声。最终仍应用自己的任务验证。

