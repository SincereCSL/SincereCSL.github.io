# Hacker News 隐藏功能指南：从 bestcomments 到 highlights


很多人每天打开 [Hacker News](https://news.ycombinator.com/)，浏览首页标题，点进几篇文章，再看看评论区。用久了，很容易把 HN 理解成一个只有热门链接和评论的技术社区。

但首页顶部的 `new | past | comments | ask | show | jobs | submit` 并没有展示它的全部功能。比如 [bestcomments](https://news.ycombinator.com/bestcomments) 可以直接阅读近期高赞评论，[highlights](https://news.ycombinator.com/highlights) 则收录了人工精选的好评论和讨论分支。还有一些入口，能帮助我们找回错过的内容、发现尚未热门的项目，甚至控制自己刷 HN 的时间。

这篇文章把这些功能整理成一份使用指南。这里的“隐藏”，主要指**没有放在首页顶部常驻导航中，或需要进入其他页面才能发现**，并不是需要特殊权限才能访问。

> 本文依据 2026 年 10 月 12 日查阅的 HN 官方页面、FAQ 和官方 API 文档整理。榜单内容会持续变化，文中重点介绍入口与使用方法。

<!--more-->

## 1. Lists：寻找隐藏入口的起点

入口：[Hacker News Lists](https://news.ycombinator.com/lists)

如果只能记住一个地址，可以先记住 `/lists`。在 HN 首页底部，`Guidelines`、`FAQ` 旁边就有一个 `Lists` 链接。打开后会看到不少专题列表，以及每个列表的简短说明。

这也解释了为什么有些功能用了很久都没注意到：它们有官方入口，但入口放在页脚，而具体功能又藏在下一层页面里。

管理员 dang 在介绍第二次机会池的[讨论中](https://news.ycombinator.com/item?id=26998308)也解释过：这些入口放在 `/lists`，因为功能太多，无法全部展示在首页。

可以先用下面这张表选择自己感兴趣的方向，再继续看详细介绍。

| 想做什么 | 对应入口 |
| --- | --- |
| 直接读近期高赞评论 | [bestcomments](https://news.ycombinator.com/bestcomments) |
| 阅读人工精选的评论与讨论 | [highlights](https://news.ycombinator.com/highlights) |
| 补看近期高赞文章 | [best](https://news.ycombinator.com/best) |
| 找当前活跃的讨论 | [active](https://news.ycombinator.com/active) |
| 回看指定日期的首页内容 | [front](https://news.ycombinator.com/front) |
| 发现刚发布的作品或问题 | [shownew](https://news.ycombinator.com/shownew)、[asknew](https://news.ycombinator.com/asknew) |
| 寻找被遗漏的有趣文章 | [pool](https://news.ycombinator.com/pool)、[invited](https://news.ycombinator.com/invited) |
| 看老账号投票形成的首页 | [classic](https://news.ycombinator.com/classic) |
| 看新账号的投稿与评论 | [noobstories](https://news.ycombinator.com/noobstories)、[noobcomments](https://news.ycombinator.com/noobcomments) |
| 找每月招聘与求职帖 | [whoishiring 的投稿列表](https://news.ycombinator.com/submitted?id=whoishiring) |

## 2. bestcomments：直接阅读近期高赞评论

入口：[Top Comments](https://news.ycombinator.com/bestcomments)

### 它筛选的是什么？

HN 的价值经常藏在评论区：原作者补充背景，亲历者讲述经历，开发者指出技术细节，或者有人用一个例子解释清楚整篇文章没有说明的问题。

`bestcomments` 把近期获得最多赞的评论集中展示出来。页面说明写明，**默认时间窗口是最近 48 小时**。这是一份跨帖子的评论列表，不必先选中某篇文章，再到评论树里逐层寻找。具体规则以 [bestcomments 页面说明](https://news.ycombinator.com/bestcomments)为准。

### 如何调整时间窗口？

页面支持 `h` 参数，单位是小时；官方页面直接给出了 `h=24` 的示例。

| 地址 | 用途 |
| --- | --- |
| [bestcomments](https://news.ycombinator.com/bestcomments) | 默认查看最近 48 小时 |
| [bestcomments?h=24](https://news.ycombinator.com/bestcomments?h=24) | 将窗口调整为最近 24 小时 |

例如，早上想花几分钟补看评论，可以收藏 `h=24` 的地址。如果几天才打开一次 HN，则可以先使用默认窗口，再通过其他入口补看文章。

这里的 `h` 调整的是近期筛选范围，不是指定历史日期。想回看某一天的首页内容，应使用后面介绍的 `front?day=...`。

### 怎样读得更有效？

我的建议是把它当作发现线索的入口：先快速浏览，遇到有启发的评论，再回到原讨论，确认它回应的问题和前提。

比如一条评论说“我们试过这个方案，最后放弃了”，单独看很吸引人，但真正有用的信息可能在父评论或后续回复里：他们的数据量有多大？失败发生在哪个环节？其他人是否有不同的经验？

高赞可以帮助筛选，但阅读时仍应检查论据与上下文。尤其是技术方案的评价，离开具体条件后，很容易被误读成普遍结论。

## 3. highlights：阅读人工精选的评论与讨论分支

入口：[Highlights](https://news.ycombinator.com/highlights)

### 它与 bestcomments 有什么不同？

`highlights` 收录特别好的评论，范围可以跨越多年；它还接受优秀讨论分支的推荐。页面提示读者，如果发现值得收录的评论或子讨论，可以通过 `hn@ycombinator.com` 告诉 HN 团队，由团队决定是否加入。参见 [Highlights 页面说明](https://news.ycombinator.com/highlights)。

因此，两者虽然都以评论为主，但筛选方式不同：

| 对比项 | bestcomments | highlights |
| --- | --- | --- |
| 主要依据 | 近期获得的赞 | 人工挑选 |
| 时间范围 | 默认最近 48 小时，可用 `h` 调整 | 可以收录历年的内容 |
| 阅读用途 | 补看近期受欢迎的评论 | 慢慢阅读精选内容 |
| 使用节奏 | 可以每天查看 | 可以偶尔打开，继续向后翻阅 |

### 适合怎样阅读？

我会把 `highlights` 当作一份评论选集来读：不用追求“今天发生了什么”，而是找值得停下来思考的内容。

一种比较好的做法，是读完一条精选评论后继续问：它为什么值得被单独保存？是因为提供了新的事实、讲清楚了一个概念，还是展示了分析问题的方法？这样读，比快速扫过一串观点更有收获。

遇到值得长期保存的内容，建议在自己的笔记里记录评论链接和一两句理解。例如：“这个例子提醒我，在比较系统性能之前，要先确认工作负载是否一致。”以后回看时，就能知道自己当时为什么收藏它。

如果想向 HN 推荐一段讨论，可以准备评论的永久链接和简短理由。是否收录由 HN 团队决定，推荐并不意味着一定会出现在列表中。

## 4. parent、context 和时间戳：把评论放回原来的讨论

在 [bestcomments](https://news.ycombinator.com/bestcomments) 和 [highlights](https://news.ycombinator.com/highlights) 中，评论旁边会出现一些很容易略过的小链接：

| 链接 | 阅读时的作用 |
| --- | --- |
| 时间戳，例如 `2 days ago` | 打开这条评论自己的页面，便于保存或分享 |
| `parent` | 查看它所回复的上一级内容 |
| `context` | 回到原帖中的上下文，定位这条评论 |
| `on: ...` 后面的标题 | 打开评论所属的帖子 |

读精选评论时，可以按“评论 → parent → context → 原文章”的顺序逐步展开。尤其遇到引用、反驳或者只写了几句话的回复，先补齐上下文，往往比立即判断它是否有道理更有用。

分享时也可以根据目的选择链接：想讨论某个具体观点，就分享评论时间戳的链接；想让对方阅读完整议题，就分享帖子链接。

## 5. best：补看近期高赞文章

入口：[Top Links](https://news.ycombinator.com/best)

`best` 是文章一侧对应的高赞榜单。与 `bestcomments` 一样，[页面说明](https://news.ycombinator.com/best)明确给出了默认的 48 小时窗口，以及通过 `h` 参数调整窗口的方法，例如 [best?h=24](https://news.ycombinator.com/best?h=24)。

它适合“昨天没看 HN，今天想快速补课”的场景。可以先在 `best` 找文章，再去 `bestcomments` 看近期讨论中受到关注的观点。两份列表分别选文章和评论，并不保证一一对应。

HN 首页排名还会受到时间、审核等因素影响，所以首页和 `best` 不必相同。关于排名，官方 [FAQ](https://news.ycombinator.com/newsfaq.html)有简短解释。

## 6. active：找正在热烈讨论的话题

入口：[Active Threads](https://news.ycombinator.com/active)

官方 [Lists](https://news.ycombinator.com/lists) 将它描述为当前最活跃的讨论列表。与高赞文章榜相比，它更适合从“讨论活跃度”的角度寻找帖子。

如果你喜欢比较不同人的经验，或者想看看一个技术话题正在引发什么争论，可以先打开 [active](https://news.ycombinator.com/active)。不过，活跃的讨论也可能有大量重复意见。我的阅读方式是先浏览不同分支，找到包含事实、代码、数据或亲身经历的回复，再决定是否继续。

官方页面没有在这里详细公布排序公式，因此不必把它理解成一个仅按评论总数排序的榜单。

## 7. front?day=：按日期回看首页内容

入口：[Past / Front](https://news.ycombinator.com/front)

`past` 本身就在顶部导航中，但它背后的日期参数很值得记住。想回看某一天，可以直接使用 `day=YYYY-MM-DD`：

```text
https://news.ycombinator.com/front?day=2026-10-01
```

打开[这个示例](https://news.ycombinator.com/front?day=2026-10-01)，页面会标出对应日期，并提供按天、月、年向前回看的导航。

它适合长假后补看内容，也适合回忆某个项目或技术事件在当时引发了什么讨论。读旧帖时，建议同时注意文章日期和评论日期，以免把历史观点当成当前状态。

这个入口提供的是某一天的首页文章列表。它并不是任意时刻的网页截图，也不意味着当前看到的票数和评论数被固定在那一天。

## 8. shownew 和 asknew：在内容热门之前发现它

入口：[New Show](https://news.ycombinator.com/shownew)、[New Ask](https://news.ycombinator.com/asknew)

大家熟悉顶部的 `show` 和 `ask`，却不一定知道还有对应的最新列表。

| 入口 | 内容 |
| --- | --- |
| `show` | 达到一定票数门槛的 Show HN 内容 |
| `shownew` | 最新的 Show HN 投稿 |
| `ask` | 达到一定票数门槛的 Ask HN 等文字投稿 |
| `asknew` | 最新的 Ask HN 等文字投稿 |

这个差异在官方 [FAQ](https://news.ycombinator.com/newsfaq.html) 中有说明：相关投稿会先出现在最新列表，进入 `ask` 或 `show` 则有一个小的票数门槛。

对喜欢试用独立开发者作品的人来说，`shownew` 很适合发现刚发布的工具。你可以在项目还没积累大量讨论时，直接查看作者介绍、试用作品，再阅读最早的反馈。

`asknew` 则适合寻找刚提出的问题。如果你有相关经验，早期提供具体回答，往往能帮助提问者，也能为后续讨论补充有用的背景。

## 9. pool 和 invited：给被遗漏的内容第二次机会

入口：[Second-Chance Pool](https://news.ycombinator.com/pool)、[Invited Reposts](https://news.ycombinator.com/invited)

一篇有趣的文章可能因为发布时间、同时出现的其他热门内容等原因，没有获得足够关注。HN 为这类内容提供了额外的发现机制。

### pool：第二次机会池

管理员 dang 在 2021 年的[官方介绍](https://news.ycombinator.com/item?id=26998308)中说明：管理员和少量审阅者会从旧投稿中挑选符合社区兴趣、可能被忽略的文章，加入池子；软件再不时随机选取内容，把它放到首页较靠后的位置。

如果首页的话题暂时不合口味，可以去 `pool` 换一种发现方式。它体现了人工选文的作用，适合寻找没有在第一次投稿时受到充分关注的内容。

### invited：受邀重新投稿的内容

按照官方 [Lists](https://news.ycombinator.com/lists) 的说明，`invited` 列出被忽略、随后受邀重新投稿的链接。

两者都与“让好内容再次被看到”有关，但 `pool` 是第二次机会池，`invited` 是受邀重投的列表。可以把 [invited](https://news.ycombinator.com/invited) 当作另一份文章线索集，发现感兴趣的主题后再回到具体帖子阅读。

## 10. classic：看看老账号投票形成的首页

入口：[Classic](https://news.ycombinator.com/classic)

虽然名字叫 `classic`，它并不是“历年经典文章总榜”。官方 [Lists](https://news.ycombinator.com/lists) 将它描述为由很早注册的账号投票形成的首页视图；[实际页面](https://news.ycombinator.com/classic)也会出现近期内容。

如果你想比较不同投票群体带来的内容差异，可以把普通首页和 `classic` 放在两个标签页中，看看同一天哪些文章的位置发生了变化。

这个入口提供的是另一种观察角度。仅凭“老账号”这个筛选条件，不能推导出其中每篇文章都更好；官网的简短说明也没有给出具体的账号年龄阈值。

## 11. noobstories 和 noobcomments：观察新账号的内容

入口：[Noob Stories](https://news.ycombinator.com/noobstories)、[Noob Comments](https://news.ycombinator.com/noobcomments)

官方 [Lists](https://news.ycombinator.com/lists) 还提供了新账号的投稿和评论列表。

这两个入口适合对社区参与方式感兴趣的读者：可以看看新用户在分享什么、关心什么，以及他们怎样加入已有讨论。它们按账号这一维度筛选，使用目的与高赞榜单不同。

其中 [noobcomments](https://news.ycombinator.com/noobcomments) 是跨帖子的评论列表，阅读时同样可以利用 `parent` 和 `context` 补齐背景。

## 12. 招聘、贡献者与颜色：几个容易漏看的专题列表

### whoishiring：集中查找每月招聘与求职帖

入口：[whoishiring 的投稿列表](https://news.ycombinator.com/submitted?id=whoishiring)

这个账号的投稿列表集中展示了每月的 `Who is hiring?` 和 `Who wants to be hired?` 等帖子，适合直接找当月或往月的招聘、求职讨论。

使用时可以先根据月份进入帖子，再用浏览器查找关键词，例如地区、技术栈或 `remote`。它与顶部的 `jobs` 是不同入口：前者是月度讨论帖，后者是 YC 公司的招聘列表，区别见官方 [FAQ](https://news.ycombinator.com/newsfaq.html)。

### leaders：发现长期活跃的贡献者

入口：[Leaders](https://news.ycombinator.com/leaders)

这是累计 karma 较高用户的列表。可以从[榜单](https://news.ycombinator.com/leaders)进入用户主页，进一步浏览他们的投稿和评论。对于想找持续输出内容的人来说，它能提供一些起点；评价具体观点时，仍应看内容本身。

### topcolors：一个轻松的小彩蛋

入口：[Custom Colors](https://news.ycombinator.com/topcolors)

这是活跃用户所选顶部颜色的样本展示，页面能看到许多十六进制颜色值。打开 [topcolors](https://news.ycombinator.com/topcolors)，会发现除了熟悉的 `#ff6600`，HN 用户还选了不少其他颜色。

## 13. 个人设置：防拖延、评论延迟和显示 dead 内容

这些功能需要登录后进入自己的个人资料页面。字段含义由官方 [FAQ](https://news.ycombinator.com/newsfaq.html) 说明。

| 设置 | 作用 |
| --- | --- |
| `noprocrast` | 启用限制连续浏览的功能 |
| `maxvisit` | 每次允许访问的分钟数，默认 20 |
| `minaway` | 两次访问之间的间隔分钟数，默认 180 |
| `delay` | 评论对其他人显示前的延迟，最多 10 分钟，留出修改时间 |
| `showdead` | 显示默认隐藏的 dead 内容；作者删除的内容仍不会恢复 |

对容易一刷就停不下来的人，`noprocrast` 很值得试试。默认配置相当于每次浏览 20 分钟，之后间隔 3 小时。

我的建议是先给阅读设置一个明确任务，比如“找一篇文章和一条有用评论”。这样，即使没有读完所有更新，也能带着具体收获结束浏览。

## 14. 官方 API：把内容接入自己的工具

入口：[Hacker News 官方 API 文档](https://github.com/HackerNews/API)

如果希望制作自己的阅读器、笔记脚本或内容面板，可以使用官方 API。例如：

```text
https://hacker-news.firebaseio.com/v0/topstories.json
https://hacker-news.firebaseio.com/v0/newstories.json
https://hacker-news.firebaseio.com/v0/beststories.json
```

这些接口返回条目 ID 列表，取得 ID 后，还需要通过 `/v0/item/<id>.json` 查询具体内容。官方文档也介绍了用户数据和 Ask、Show、Jobs 等列表接口。

网页列表与 API 并非完全一一对应。官方文档没有列出与 `bestcomments`、`highlights` 对应的专用接口；如果目标是阅读这两份精选列表，直接收藏网页最方便。

## 怎样把这些入口用起来？

不必每天打开所有列表。可以根据阅读目的，为自己保留几个书签：

| 阅读场景 | 可以尝试的顺序 |
| --- | --- |
| 每天只有几分钟 | `best?h=24` 找文章 → `bestcomments?h=24` 找评论 |
| 周末想读得深入一点 | `highlights` → 评论上下文 → 原文章 |
| 想发现新工具 | `shownew` → 试用作品 → 阅读作者与用户交流 |
| 错过了几天的内容 | `front?day=...` 逐日回看 → 选感兴趣的讨论 |
| 想换一批内容 | `pool`、`invited`、`classic` |

如果从两个入口开始，我会选择 `bestcomments` 和 `highlights`：前者便于补看近期讨论，后者适合慢读。遇到值得思考的评论，就用 `parent` 和 `context` 把它放回讨论里。

HN 有意思的地方，经常在于一个标题下面连接着许多不同的经验。用这些入口找到线索，再花时间读懂一段完整交流，比不断刷新首页更容易留下收获。

## 参考资料

- [Hacker News Lists：官方列表目录](https://news.ycombinator.com/lists)
- [Top Comments：bestcomments 及时间窗口说明](https://news.ycombinator.com/bestcomments)
- [Highlights：精选评论及推荐方式](https://news.ycombinator.com/highlights)
- [Top Links：best 及时间窗口说明](https://news.ycombinator.com/best)
- [Hacker News FAQ：排名、列表门槛与个人设置](https://news.ycombinator.com/newsfaq.html)
- [Show HN: Second-Chance Pool：管理员对第二次机会池的介绍](https://news.ycombinator.com/item?id=26998308)
- [HackerNews/API：官方 API 文档与示例](https://github.com/HackerNews/API)

