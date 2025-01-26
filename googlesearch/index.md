# Google 搜索技巧


## Google 搜索技巧

### 1. 基础搜索运算符

#### 精确匹配搜索 - 引号 `""`
- 当你需要搜索完全匹配的词组时使用
- 例如：
  - `"最好的编程语言"` - 完整匹配这个短语
  - `"python error"` - 精确匹配错误信息
  - `"how to" "python"` - 组合多个精确匹配
- 适用场景：
  - 搜索特定的错误信息
  - 查找精确的引用或句子
  - 寻找特定的标题或名称
  - 搜索特定的代码片段
- 使用技巧：
  - 可以组合多个引号搜索
  - 引号内的空格会被保留
  - 标点符号最好也包含在内

#### 排除特定词 - 减号 `-`
- 在关键词前加减号可以排除包含该词的结果
- 实例：
  - `java -咖啡` (搜索Java编程而非咖啡)
  - `python -蛇 -宠物` (编程相关)
  - `苹果 -手机 -水果` (公司相关)
- 使用技巧：
  - 减号必须紧贴要排除的词
  - 可以同时使用多个减号
  - 可以排除特定网站：`python -site:csdn.com`
  - 可以排除特定文件类型：`教程 -filetype:pdf`
- 常见应用：
  - 去除购物网站：`-site:taobao.com -site:jd.com`
  - 去除视频站点：`-site:bilibili.com -site:youtube.com`
  - 排除培训广告：`-培训 -招生 -报名`

#### 站内搜索 - `site:`
- 限定在特定网站内搜索内容
- 基本语法：`site:网站域名 搜索词`
- 实例：
  - `site:zhihu.com 人工智能`
  - `site:edu.cn 论文`
  - `site:gov.cn 政策`
- 高级用法：
  - 指定多个站点：
    ```
    site:(github.com OR stackoverflow.com) python错误
    ```
  - 限定子域名：
    ```
    site:docs.python.org 教程
    site:help.github.com 指南
    ```
  - 组合其他运算符：
    ```
    site:edu.cn filetype:pdf "机器学习"
    site:github.com "README.md" "最佳实践"
    ```
- 实用技巧：
  - 学术搜索：`site:edu.cn OR site:ac.cn`
  - 官方文档：`site:docs.*.com`
  - 技术问答：`site:(stackoverflow.com OR github.com)`
  - 政府文件：`site:gov.cn filetype:pdf`

### 2. 高级搜索技巧

#### 文件类型搜索 - `filetype:`
- 搜索特定格式的文件
- 常用文件类型：
  - `filetype:pdf` - PDF文档
  - `filetype:ppt` - 演示文稿
  - `filetype:doc` - Word文档
  - `filetype:xls` - Excel表格
  - `filetype:txt` - 文本文件
  - `filetype:zip` - 压缩文件
- 实例：
  - `filetype:pdf python教程 site:edu.cn`
  - `filetype:ppt 项目管理`
  - `filetype:doc 简历模板`
- 高级用法：
  - 多文件类型：`(filetype:doc OR filetype:pdf) 开发文档`
  - 排除某类文件：`开发文档 -filetype:pdf`
  - 组合站点搜索：`site:github.com filetype:md README`

#### 通配符搜索 - `*`
- 用星号代替任意文字
- 使用场景：
  - 记不清完整词句时
  - 搜索变体形式
  - 查找特定模式
- 例子：
  - `如何成为一名*工程师`
  - `* 的使用方法`
  - `2024年*趋势`
- 高级应用：
  - 歌词搜索：`"我爱* 就像*"`
  - 成语搜索：`"一* 一*"`
  - 标题匹配：`"如何提高* 效率"`

#### 多关键词搜索 - `OR` 或 `|`
- 搜索多个可能的关键词
- 使用大写的OR或竖线符号
- 实例：
  - `前端 OR 后端 开发`
  - `Python | Java | C++ 教程`
- 可以组合多个条件：
  - `(Python | Java) site:github.com`
  - `(北京 | 上海 | 深圳) 招聘`

#### 标题搜索 - `intitle:` 和 `allintitle:`
- `intitle:` - 搜索标题中包含特定词的页面
- `allintitle:` - 搜索标题中包含所有指定词的页面
- 使用方法：
  - `intitle:python 教程` - 标题含"python"
  - `allintitle:python 入门 教程` - 标题同时含这三个词
- 实用场景：
  - 找教程：`intitle:教程 python`
  - 找文档：`intitle:documentation react`
  - 找视频：`intitle:视频教程 golang`

#### 网址搜索 - `inurl:` 和 `allinurl:`
- `inurl:` - URL中包含特定词
- `allinurl:` - URL中包含所有指定词
- 应用示例：
  - `inurl:blog python` - URL含"blog"
  - `allinurl:github python project`
- 实用技巧：
  - 找博客：`inurl:blog site:medium.com`
  - 找项目：`inurl:project site:github.com`
  - 找文档：`inurl:docs python`

#### 正文内容搜索 - `intext:` 和 `allintext:`
- `intext:` - 正文中包含特定词
- `allintext:` - 正文中包含所有指定词
- 使用场景：
  - `intext:机器学习 算法`
  - `allintext:python 错误 解决方案`
- 组合应用：
  - `intext:面试题 site:zhihu.com`
  - `allintext:源码分析 site:github.com`

#### 相关词搜索 - `related:` 和 `AROUND(n)`
- `related:` - 查找相关网站
- `AROUND(n)` - 查找两个词距离在n个词以内的结果
- 实例：
  - `related:python.org` - Python相关网站
  - `python AROUND(3) 教程` - 两词相距3个词内
- 实用场景：
  - 寻找替代网站：`related:stackoverflow.com`
  - 寻找相近内容：`javascript AROUND(5) framework`

#### 时间和数字范围搜索
- 数字范围 `..`：
  - `手机 3000..5000 元`
  - `显示器 24..32 英寸`
  - `2020..2024 技术趋势`
- 时间范围：
  - `before:2024-01-01` - 某日期之前
  - `after:2023-01-01` - 某日期之后
  - 组合示例：
    - `after:2023-01-01 before:2024-01-01 编程语言排行`
    - `after:2024 site:github.com "machine learning"`

### 3. 实用搜索命令

#### 计算和单位转换
- 数学计算：
  - 基础运算：`2 * 3 + 4`
  - 高级计算：
    - `sin(30) + cos(60)`
    - `sqrt(144)`
    - `2^10`
    - `(15% of 80) * 2`
    - `log(1000)`
    - `5!`
- 单位换算：
  - 货币：`100 USD to CNY`
  - 长度：`5 miles to km`
  - 面积：`100 平方米 to 平方英尺`
  - 重量：`50 公斤 转 磅`
  - 温度：`32F to C`

#### 时间和日期查询
- 时区转换：
  - `北京时间 3pm in New York`
  - `Tokyo time in London`
- 日期计算：
  - `Easter 2024`
  - `days between 2024-01-01 and 2024-12-31`
  - `weeks until Christmas`
- 日出日落：`sunrise/sunset [城市名]`
- 节假日：`[节日名] [年份]`

#### 实时信息查询
- 天气信息：
  - `天气 [城市名]`
  - `[城市]未来一周天气`
  - `weather alerts [地区]`
- 交通状态：
  - `flight [航班号]`
  - `[城市]实时路况`
- 自然灾害：
  - `earthquakes near [地点]`
  - `台风实时路径`
- 股票市场：
  - `[股票代码] stock`
  - `[公司名] stock price`

#### 健康相关查询
- 营养成分：
  - `calories in apple`
  - `protein in chicken breast`
- 运动消耗：
  - `calories burned running 30 minutes`
  - `calories walking 5km`
- BMI计算：
  - `BMI calculator`
  - `healthy weight for 175cm`

#### 实用工具命令
- IP地址查询：
  - `what is my ip`
  - `ip location 8.8.8.8`
- 网站状态：
  - `is facebook down`
  - `site status github.com`
- 字符计数：
  - `word count "your text here"`
  - `character count "测试文本"`

#### 娱乐功能
- 掷骰子：
  - `roll a die`
  - `roll 2d6`
- 随机数：
  - `random number 1-100`
  - `random number generator`
- 游戏：
  - `play pacman`
  - `play snake`
  - `play solitaire`

#### 紧急信息查询
- 天气预警：
  - `weather alerts near me`
  - `台风实时路径`
- 地震信息：
  - `earthquakes near me`
  - `recent earthquakes in Japan`
- 急救信息：
  - `first aid for burns`
  - `CPR steps`

### 4. 搜索技巧组合使用

#### 实例一：学术研究
- 论文搜索组合：
```
site:edu.cn filetype:pdf "机器学习" after:2023 -"课程设计"
```
- 这个组合可以：
  - 限定在教育网站搜索
  - 只搜索PDF格式
  - 精确匹配"机器学习"
  - 限定2023年后的内容
  - 排除课程设计类文档

#### 实例二：技术问题排查
- 错误信息搜索：
```
site:(stackoverflow.com OR github.com) "RuntimeException" "解决方案" after:2023
```
- 搜索策略：
  - 在主流技术社区中搜索
  - 精确匹配错误信息
  - 查找最新的解决方案
  - 支持中英文混合查询

#### 实例三：产品调研
- 产品评测搜索：
```
(小米 OR 华为) 手机 15000..20000 评测 -二手 filetype:pdf after:2024-01
```
- 搜索要点：
  - 指定多个品牌
  - 设定价格范围
  - 排除二手信息
  - 限定最新评测
  - 专业评测文档

#### 实例四：编程资源查找
- 开发文档搜索：
```
site:github.com "React Native" (tutorial OR 教程) stars:>1000 after:2023
```
- 搜索特点：
  - 在GitHub上搜索
  - 查找高质量教程
  - 限定星标数量
  - 确保资源新鲜度

#### 实例五：求职信息搜索
- 工作机会搜索：
```
site:(linkedin.com OR zhipin.com) ("前端开发" OR "前端工程师") (React OR Vue) 深圳 after:2024
```
- 搜索策略：
  - 多平台组合
  - 职位名称变体
  - 技术栈要求
  - 地理位置限定
  - 时间限制

#### 参考资料：
文章资料：

- [36 Google Search tricks to find exactly what you're looking for](https://zapier.com/blog/advanced-google-search-tricks)
- [How to Google like a Pro – 10 Tips for More Effective Googling](https://www.freecodecamp.org/news/how-to-google-like-a-pro-10-tips-for-effective-googling)
- [Maximize Your Google Search Skills: 10 Surprising Tricks](https://readmedium.com/zh/maximize-your-google-search-skills-10-surprising-tricks-921c16188f57)

视频资料
- [Google Like a Pro – All Advanced Search Operators Tutorial [2023 Tips]](https://www.youtube.com/watch?v=BRiNw490Eq0&ab_channel=freeCodeCamp.org)
- [https://www.youtube.com/watch?v=C-2YMhMu5Lc&ab_channel=Dave%27sGarage](https://www.youtube.com/watch?v=C-2YMhMu5Lc&ab_channel=Dave%27sGarage)



