# Unix 与 Linux 入门：从命令行到系统管理的学习路线


2009 年，左耳朵耗子（陈皓）在 CoolShell 整理过一份 [Linux/Unix 新手和专家教程](https://coolshell.cn/articles/1042.html)。文章的学习方向今天仍然成立，但其中不少课程已经停止维护、迁移或无法访问。与其继续收藏一长串来历不明的教程，不如先建立正确的概念，再把官方手册、发行版文档和高质量课程当作长期入口。

本文是一条可以实际执行的学习路线。你会先弄清 Unix、Linux 和 Shell 分别是什么，然后在一个安全的实验目录中练习文件、管道、进程、权限与脚本，最后进入服务、日志、网络和系统编程。文末资料均尽量指向标准组织、项目官网、发行版官方文档或课程原站；链接已于 **2026 年 7 月 20 日**重新核验。

> 不要以 `root` 用户做本文的基础练习，也不要从网页复制不理解的 `sudo`、`rm -rf`、磁盘格式化或管道执行脚本命令。命令行的力量和风险来自同一个地方：它会准确执行你写下的内容。

## 先把几个名字分清楚

### Unix：家族、思想，也是一项认证标准

Unix 最初诞生于贝尔实验室，后来发展出 System V、BSD 等分支，并影响了大量操作系统。今天日常语境中的“Unix”可能指三件不同的事：历史上的 Unix 系统、采用相似接口与设计思想的类 Unix 系统，或者通过 The Open Group 认证并可使用 `UNIX®` 商标的产品。

现代 Unix 的共同接口主要由 Single UNIX Specification 和 POSIX 描述。The Open Group 的 [Single UNIX Specification V5（2024）介绍](https://www.unix.org/overview.html)说明了当前标准由哪些部分组成；需要判断一段 Shell 或 C 程序能否跨系统工作时，可以查 [POSIX.1-2024 Shell Command Language](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html)。标准适合查边界和可移植性，不适合当第一本入门教程从头硬啃。

### Linux：严格来说只是内核

Linux 负责进程调度、内存、设备、文件系统、网络和系统调用等内核工作。用户平时安装的 Ubuntu、Debian、Fedora、Arch Linux 并不只是 Linux 内核，而是由内核、GNU/其他用户空间工具、软件包管理器、服务管理器、桌面环境及发行版配置共同组成的完整操作系统。

因此，下面几句话可以同时成立：

- Ubuntu 和 Android 都使用 Linux 内核，但用户空间与使用方式差异很大。
- macOS 是 Unix 认证的操作系统，却不是 Linux。
- Debian 和 Fedora 都是 GNU/Linux 发行版，但软件包管理命令分别常见 `apt` 和 `dnf`。
- Linux 上大量常用命令来自 GNU Coreutils，而不是来自 Linux 内核。

### 终端、Shell 与命令不是一回事

终端（Terminal）是显示输入输出的界面；Shell 是读取并解释命令的程序；`ls`、`grep`、`ssh` 则是由 Shell 启动的程序或 Shell 内建命令。

```text
键盘输入 -> 终端 -> Shell（bash/zsh）-> 命令和系统调用 -> Linux/Unix 内核
```

先确认自己正在使用什么：

```bash
uname -srm                 # 内核名称、版本和硬件架构
printf '%s\n' "$SHELL"    # 登录 Shell
ps -p "$$" -o comm=       # 当前 Shell 进程
command -v ls              # Shell 会从哪里找到 ls
type cd                    # cd 通常是 Shell 内建命令
```

本文以 Linux 上的 Bash 和 GNU 工具为主。macOS 默认使用 Zsh，并包含 BSD 版本的许多工具；相同命令的选项可能不同，例如 GNU 与 BSD `sed` 的 `-i` 参数就不完全兼容。需要写跨平台脚本时，应明确目标是 POSIX `sh`、Bash，还是特定系统上的工具集。

## 准备一个练习环境

现在入门配置的云服务器价格已经很低，如果能够接受持续计费并愿意学习基本的公网安全，直接购买一台小规格云服务器通常是最方便的选择。它提供真实、长期在线的 Linux 环境，还能顺便练习 SSH、软件包、systemd、日志、防火墙、域名和 Web 服务，比只在本机记命令更接近实际开发与运维工作。

建议选择离自己较近的地域、当前仍受支持的 Ubuntu LTS 或 Debian stable 镜像。学习命令行和运行小型服务不需要追求高配置，先选服务商提供的入门规格即可；以后不够用再升级。

| 云服务 | 推荐入口 | 适合情况 |
| --- | --- | --- |
| AWS | [Amazon Lightsail Linux/Unix 快速入门](https://docs.aws.amazon.com/lightsail/latest/userguide/getting-started-with-amazon-lightsail.html) | 套餐和管理界面相对简单，可选择 Ubuntu、Debian 等镜像并直接使用浏览器 SSH，适合第一次使用 AWS |
| Google Cloud | [Compute Engine 创建 Linux VM](https://docs.cloud.google.com/compute/docs/create-linux-vm-instance?hl=zh-cn) | 可从控制台创建 Ubuntu 等 Linux 虚拟机并使用浏览器 SSH，适合同时学习 Google Cloud 项目、网络和 IAM |
| Microsoft Azure | [通过 Azure 门户创建 Linux VM](https://learn.microsoft.com/zh-cn/azure/virtual-machines/linux/quick-create-portal) | 官方入门流程覆盖 Ubuntu、SSH 密钥、网络安全组和资源清理，适合已有 Microsoft/Azure 账号的用户 |
| Oracle Cloud | [OCI：启动第一台 Linux 实例](https://docs.oracle.com/en-us/iaas/Content/Compute/tutorials/first-linux-instance/overview.htm) | 教程从网络、子网、SSH 密钥到 Oracle Linux 实例完整配置，适合体验 OCI Compute |
| 阿里云 | [ECS 官方入门指引](https://help.aliyun.com/zh/ecs/quick-start) | 中国大陆访问方便，可使用 ECS 或面向入门用户的轻量应用服务器 |
| 腾讯云 | [快速配置 Linux 云服务器](https://cloud.tencent.com/document/product/213/2936) | 官方文档同时介绍 CVM，并建议初学者优先考虑轻量应用服务器 Lighthouse |
| Cloudflare | [Cloudflare Containers](https://developers.cloudflare.com/containers/) | 它是与 Workers 配合的容器运行环境，不是传统 VPS；需要 Workers 付费计划，并通过 Wrangler [连接 SSH](https://developers.cloudflare.com/containers/ssh/)，适合容器应用实验，不适合练完整主机管理 |

购买云服务器时，不要一路沿用默认选项。至少完成下面这些设置：

1. 使用 SSH 密钥登录，避免启用弱密码；日常登录使用普通用户，需要时再执行 `sudo`。
2. 在安全组或防火墙中只开放 SSH 端口，并尽可能限制为自己的出口 IP；真正部署网站时再开放 `80` 和 `443`。
3. 不要把数据库、管理后台或临时测试服务直接暴露到整个互联网。
4. 开启费用提醒，确认公网流量、云盘、快照和公网 IP 是否单独计费，并检查是否开启了自动续费。
5. 做磁盘、网络或权限实验前创建快照；学习结束后及时释放不再使用的实例、云盘和公网 IP，仅关机不一定停止计费。

> 云服务器有公网地址，错误配置可能在几分钟内就被自动扫描发现。初学阶段不要在云服务器上练习不理解的防火墙清空、磁盘格式化、批量用户管理或攻击测试，也不要把私钥提交到 Git 仓库。

如果暂时不想购买云服务器，也可以使用本地环境：

| 当前平台 | 本地方案 | 说明 |
| --- | --- | --- |
| Linux | 普通非 root 用户或 Linux 虚拟机 | 基础命令可以直接练；系统管理实验建议使用可恢复快照的虚拟机 |
| Windows | [Microsoft 官方 WSL 安装指南](https://learn.microsoft.com/windows/wsl/install) | 安装 Ubuntu 后即可获得真实 Linux 用户空间，适合命令行与开发工具学习 |
| macOS | 自带终端用于 Unix/Shell 基础，Linux 专属内容使用虚拟机 | 不要默认 GNU 命令参数与 macOS 的 BSD 工具完全相同 |
| 任意桌面系统 | Ubuntu/Debian 虚拟机 | 不产生云服务费用，也不会把实验端口暴露到公网，适合高风险操作 |

创建只属于本教程的实验目录：

```bash
mkdir -p "$HOME/unix-lab"/{inbox,archive,bin,logs}
cd "$HOME/unix-lab"
pwd
```

无论使用云服务器还是本地环境，后面的基础练习都只在这个目录中做。开始前先养成三个习惯：

1. 用 `pwd` 确认自己在哪里。
2. 用 `ls -la` 查看将被操作的对象。
3. 先使用非破坏性的命令验证筛选条件，再执行移动或删除。

## 第一课：会查手册，比背命令更重要

Unix 世界把帮助放在系统旁边。遇到不熟悉的命令，按这个顺序查：

```bash
type -a printf            # 它是内建命令、别名，还是外部程序？
help printf               # Bash 内建命令帮助
printf --help             # GNU 程序的简要帮助；并非所有命令都支持
man printf                # 本机手册，按 / 搜索，按 n 下一个，按 q 退出
man -k 'copy files'       # 按关键词搜索手册描述
info coreutils 'cp invocation'
```

`man` 手册分区很重要。同名条目可能属于不同层：

| 分区 | 内容 | 示例 |
| --- | --- | --- |
| 1 | 用户命令 | `man 1 printf` |
| 2 | Linux 系统调用 | `man 2 open` |
| 3 | C 库函数 | `man 3 printf` |
| 5 | 文件格式 | `man 5 passwd` |
| 7 | 概念、约定和协议 | `man 7 signal` |
| 8 | 系统管理命令 | `man 8 mount` |

在线查阅时，[Linux man-pages](https://man7.org/linux/man-pages/) 提供 Linux 内核—用户空间接口和 C 库接口的手册；`ls`、`cp`、`sort` 等 GNU 工具则以 [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html) 为权威说明。最可靠的答案通常仍是当前机器上的 `man`，因为它对应你实际安装的版本。

## 第二课：文件、目录和“一切皆可组合”

先创建几份练习数据：

```bash
cd "$HOME/unix-lab"
printf '%s\n' 'INFO login alice' 'ERROR disk full' 'INFO logout alice' > logs/app.log
printf '%s\n' 'ERROR timeout' 'INFO login bob' >> logs/app.log
touch inbox/{report-01.txt,report-02.txt,notes.md}
```

然后观察文件系统，而不是急着修改它：

```bash
pwd
ls -lah
find . -maxdepth 2 -type f -print
file logs/app.log
stat logs/app.log
du -sh .
```

必须掌握的路径概念只有几个：`/` 是根目录，`.` 是当前目录，`..` 是父目录，`~` 通常展开为用户主目录。以 `/` 开头的是绝对路径，其他是相对路径。文件名以 `.` 开头时通常被 `ls` 默认隐藏，但它并没有特殊的安全属性。

尝试安全的复制、移动和链接：

```bash
cp -i inbox/report-01.txt archive/
mv -i inbox/report-02.txt archive/report-latest.txt
ln -s ../logs/app.log archive/app-current.log
ls -l archive/
```

硬链接指向同一个 inode，符号链接保存的是另一条路径。可以用下面的实验观察区别：

```bash
ln logs/app.log logs/app-hardlink.log
ls -li logs/app.log logs/app-hardlink.log archive/app-current.log
```

## 第三课：标准输入输出、重定向和管道

传统 Unix 工具倾向于做好一件事，并通过文本流组合。进程通常有三个标准文件描述符：标准输入 `0`、标准输出 `1` 和标准错误 `2`。

```bash
grep 'ERROR' logs/app.log                     # 输出到终端
grep 'ERROR' logs/app.log > logs/errors.log   # 覆盖标准输出到文件
grep 'WARN' logs/app.log 2> logs/grep.err     # 单独保存错误输出
grep 'INFO' logs/app.log >> logs/info.log     # 追加而不是覆盖
wc -l < logs/app.log                          # 从文件提供标准输入
```

管道 `|` 把左侧命令的标准输出交给右侧命令的标准输入。下面统计每种日志级别出现的次数：

```bash
cut -d' ' -f1 logs/app.log | sort | uniq -c | sort -nr
```

理解每一段后再组合：

- `cut` 取第一列；
- 第一个 `sort` 把相同值排在一起；
- `uniq -c` 计数；
- `sort -nr` 按数字逆序排列。

这比背下一条“神奇命令”更重要。排查长管道时，可以从左到右逐段执行，或者插入 `tee` 保存中间结果：

```bash
cut -d' ' -f1 logs/app.log | tee /tmp/log-levels.txt | sort | uniq -c
```

> `>` 会在命令运行前截断目标文件。不要写成 `sort data.txt > data.txt`，否则 Shell 可能先清空输入文件。写到临时文件，确认成功后再用 `mv` 替换。

## 第四课：进程、作业与信号

程序运行后成为进程，每个进程都有 PID、父进程、用户、环境和打开的文件。先启动一个可以安全终止的后台任务：

```bash
sleep 300 &
jobs -l
ps -o pid,ppid,user,stat,etime,command -p "$!"
kill "$!"
wait "$!"
```

这里的 `&` 让命令在后台运行，`$!` 是最近一个后台任务的 PID。普通 `kill PID` 默认发送 `SIGTERM`，允许程序清理资源后退出；`kill -9` 发送无法捕获的 `SIGKILL`，只应在进程无法正常结束时作为最后手段。

交互使用时还要知道：

- `Ctrl+C` 通常向前台进程发送 `SIGINT`；
- `Ctrl+Z` 暂停前台作业；
- `bg` 让暂停的作业在后台继续；
- `fg` 把后台作业带回前台；
- `ps` 展示快照，`top` 动态观察资源使用。

进一步排障时，`pgrep` 按条件找进程，`lsof` 查看打开的文件，`strace` 在 Linux 上跟踪系统调用。先学会观察，再考虑终止进程。

## 第五课：用户、组与权限

运行下面的命令观察身份和默认权限：

```bash
id
groups
umask
ls -ld . logs logs/app.log
```

`ls -l` 中的 `rwx` 分成所有者、所属组和其他用户三组。对普通文件，`r`/`w`/`x` 分别表示读、写、执行；对目录，它们大致表示列出名称、修改目录项和进入/检索目录。目录的 `x` 和文件的 `x` 含义不同，这是初学者最容易忽略的细节。

```bash
printf '%s\n' '#!/usr/bin/env bash' 'printf "hello\n"' > bin/hello
chmod u+x bin/hello
bin/hello
chmod go-rwx logs/app.log
ls -l bin/hello logs/app.log
```

尽量用 `chmod u+x`、`chmod go-rwx` 这样的符号形式表达意图。熟悉后再使用八进制权限，例如 `755` 等于所有者 `rwx`、组和其他用户 `r-x`。不要用 `chmod 777` 掩盖权限设计问题。

`sudo` 不是“命令失败后的万能前缀”，它是在策略允许时以另一身份执行命令。使用前先回答三个问题：为什么当前用户没有权限、这条命令会修改什么、能否只给最小范围的权限。不要为了编辑一个个人文件而使用 `sudo`，否则很容易留下属于 `root` 的文件。

## 第六课：用 Shell 脚本固化重复工作

当一段可靠的命令需要重复执行时，再把它写成脚本。创建 `bin/disk-report`：

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

if (( $# == 0 )); then
  printf '用法：%s <目录>...\n' "$0" >&2
  exit 64
fi

for dir in "$@"; do
  if [[ -e "$dir" ]]; then
    du -sh -- "$dir"
  else
    printf '不存在：%s\n' "$dir" >&2
  fi
done
```

赋予执行权限并运行：

```bash
chmod u+x bin/disk-report
bin/disk-report logs archive /not-exist
printf 'exit=%s\n' "$?"
```

脚本中最值得尽早养成的习惯是：

- 明确解释器，不要把 Bash 语法交给 `/bin/sh` 猜；
- 变量展开通常写成 `"$var"`，避免空格和通配符造成意外拆分；
- 用 `"$@"` 原样传递全部参数；
- 正常输出写到标准输出，诊断写到标准错误；
- 用退出状态表示成功或失败；
- 用 [ShellCheck](https://www.shellcheck.net/) 做静态检查，但仍要亲自测试边界条件。

[GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html) 是 Bash 语法的权威来源；如果目标是可移植的 `/bin/sh` 脚本，则应以 POSIX Shell 规范为边界，不能默认数组、`[[ ... ]]` 或进程替换等 Bash 扩展存在。

## 第七课：进入 Linux 系统管理

掌握前六课后，再学习发行版相关的管理工具。先确认系统，而不是看到教程就复制 `apt` 或 `yum`：

```bash
cat /etc/os-release
uname -r
command -v apt dnf pacman zypper
```

主流 Linux 管理工作可以沿着下面的观察链学习：

```bash
# 容量与内存
df -h
du -xh /var 2>/dev/null | sort -h | tail
free -h

# systemd 系统上的服务和日志
systemctl --failed
systemctl status ssh
journalctl -b -p warning
journalctl -u ssh --since today

# 网络地址、路由、监听端口和 HTTP
ip -brief address
ip route
ss -lntup
curl -I https://www.kernel.org/
```

排障不要从“重启试试”开始。一个更有迁移价值的顺序是：

1. 明确期望和实际现象，记录完整错误信息与时间。
2. 检查进程是否存在、退出状态是什么。
3. 检查服务状态和同一时间段的日志。
4. 检查配置、权限、容量、端口和依赖。
5. 做最小、可回滚的修改，然后验证。

systemd 系统应直接查 [systemd 官方手册](https://www.freedesktop.org/software/systemd/man/latest/)。Debian/Ubuntu 用户可以把有中文版本的 [Debian 参考手册](https://www.debian.org/doc/manuals/debian-reference/index.zh-cn.html)作为从命令行走向系统管理的主线资料。

## 四周学习路线

每天花 45～60 分钟，至少一半时间亲手操作。不要只看视频。

| 周次 | 学习重点 | 必做产出 |
| --- | --- | --- |
| 第 1 周 | 路径、文件、帮助系统、编辑器 | 只靠 `man` 完成文件整理；写一页自己的命令笔记 |
| 第 2 周 | 文本、正则、管道、重定向 | 从一份日志中统计错误类型、用户或状态码 |
| 第 3 周 | 进程、权限、Shell 脚本、SSH | 写一个带参数、错误处理和退出状态的脚本 |
| 第 4 周 | 包管理、systemd、日志、网络 | 在虚拟机部署 SSH 或 Web 服务，并用日志与端口工具验证 |

每周复盘时，随机挑一个常用命令，回答五个问题：它是 Shell 内建还是外部程序？输入从哪里来？正常输出和错误输出到哪里去？退出状态是什么？它在 GNU、BSD/macOS 和 POSIX 中是否相同？能回答这些问题，说明你学到的是模型，而不是命令清单。

## 经过核验的一手学习资料

下面不是“越多越好”的收藏夹，而是按用途筛选后的长期入口。

### 零基础与系统使用

| 资料 | 适合阶段 | 特点 |
| --- | --- | --- |
| [Ubuntu：The Linux command line for beginners](https://ubuntu.com/desktop/docs/en/latest/tutorial/the-linux-command-line-for-beginners/) | 第 1 周 | Canonical 官方图文教程，有连续练习，覆盖文件、管道和 `sudo` 安全 |
| [Introduction to Linux（LFS101）](https://training.linuxfoundation.org/training/introduction-to-linux/) | 第 1～4 周 | Linux Foundation 免费课程，覆盖主要发行版家族、图形界面、命令行、进程、网络、安全和 Bash；需要注册学习平台账号 |
| [Debian 参考手册（简体中文）](https://www.debian.org/doc/manuals/debian-reference/index.zh-cn.html) | 第 2 周以后 | Debian 官方维护，既讲类 Unix 基础，也讲包管理、systemd、SSH、存储和安全 |
| [ArchWiki Installation guide](https://wiki.archlinux.org/title/Installation_guide) | 熟悉基础后 | Arch Linux 官方 Wiki 的安装主线，适合理解启动、分区、挂载、网络与软件包；不建议零基础直接在主力机实操 |

### 标准、命令与系统接口

| 资料 | 用途 |
| --- | --- |
| [The Single UNIX Specification V5（2024）](https://www.unix.org/overview.html) | 理解 UNIX 标准、认证与 POSIX 的关系 |
| [POSIX.1-2024 Shell Command Language](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html) | 查询标准 Shell 的语法、展开、重定向和退出状态 |
| [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html) | 查询 Bash 内建命令、语法和扩展能力 |
| [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html) | 查询 GNU `cat`、`ls`、`cp`、`sort`、`cut`、`du` 等工具 |
| [Linux man-pages online](https://man7.org/linux/man-pages/) | 查询系统调用、C 库、文件格式和 Linux 约定；本机版本仍优先用 `man` |
| [systemd Manuals](https://www.freedesktop.org/software/systemd/man/latest/) | 查询 `systemctl`、`journalctl`、unit 文件及 systemd 机制 |
| [Linux Kernel Documentation](https://www.kernel.org/doc/html/latest/) | 内核管理、用户空间 API、开发流程与各子系统的官方文档；适合进阶，不是入门命令教程 |

### 视频与带练习的课程

1. [MIT Missing Semester 2020 课程主页](https://missing.csail.mit.edu/2020/)：11 讲，每讲都有讲义和练习；最值得先看的三讲是 [The Shell](https://missing.csail.mit.edu/2020/course-shell/)、[Shell Tools and Scripting](https://missing.csail.mit.edu/2020/shell-tools/) 和 [Data Wrangling](https://missing.csail.mit.edu/2020/data-wrangling/)。
2. [MIT Missing Semester 官方 YouTube 播放列表](https://www.youtube.com/playlist?list=PLyzOVJj3bHQuloKGG59rS43e29ro7I57J)：与上述讲义对应的完整录像。如果所在网络无法访问 YouTube，课程原站的讲义和练习仍可独立使用。
3. [Linux Foundation LFS101](https://training.linuxfoundation.org/training/introduction-to-linux/)：系统化 Linux 入门课，视频/课程内容在注册后进入学习平台，课程本身免费。

### 系统编程进阶

完成基础系统管理后，如果目标是理解 Linux/Unix API，而不只是会用命令，可以进入下面三条主线：

- 读 `man 2` 和 `man 3`，从 `open`、`read`、`write`、`fork`、`execve`、`wait`、`signal`、`mmap`、`socket` 开始。
- 阅读 Michael Kerrisk 的 [The Linux Programming Interface 官方介绍与配套源码](https://www.man7.org/tlpi/)，把文件 I/O、进程、信号、线程、IPC 和网络各写一个小实验。
- 需要理解内核实现时再读 [Linux Kernel Documentation](https://www.kernel.org/doc/html/latest/)，并从内核的用户空间 API 和开发流程切入，不要一开始就按目录通读源码。

## 如何判断一份教程是否值得继续看

最后给自己一套过滤规则，它比任何资源清单都耐用：

- 是否标明适用的发行版、版本、Shell 和权限？
- 是否解释命令的输入、输出、副作用和失败方式？
- 是否链接到项目官网、手册或标准，而不是互相抄写？
- 是否仍在维护，示例是否适用于当前受支持的系统？
- 是否鼓励先读、预览、备份和回滚，而不是随处加 `sudo`？
- 你能否在隔离环境中重现结果，并用 `man` 解释每个参数？

Unix/Linux 的学习终点不是记住几百条命令，而是形成一种稳定的工作方式：先观察系统，把任务拆成小工具，用清晰的数据流组合它们，阅读本机文档，并让每一次修改都可解释、可验证、可回滚。

