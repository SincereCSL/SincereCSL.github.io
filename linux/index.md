# Linux 命令速查


Linux 命令很多，但日常开发和服务器维护真正高频使用的只是一小部分。本文按使用场景整理最常用的命令，并给出可以直接修改使用的示例。

如果只想快速查某条命令，推荐收藏 [Quick Reference 的 Linux 命令中文速查表](https://quickref.me/zh-CN/docs/linux-command.html)。它把系统、文件、进程、权限、网络、压缩和磁盘等命令集中在一个页面中，很适合临时查阅和分享给刚接触 Linux 的同学。

> 本文默认使用常见的 GNU/Linux 环境和 Bash。不同发行版、工具版本以及 macOS/BSD 的参数可能存在差异；不确定时，优先执行 `man <命令>` 或 `<命令> --help` 查看当前机器上的说明。

## 高频命令速查

| 命令 | 用途 |
| --- | --- |
| `pwd` | 显示当前目录 |
| `ls -lah` | 查看目录内容、隐藏文件和易读的文件大小 |
| `cd <目录>` | 切换目录 |
| `mkdir -p <目录>` | 递归创建目录 |
| `cp -a <源> <目标>` | 保留属性复制文件或目录 |
| `mv <源> <目标>` | 移动或重命名 |
| `rm -i <文件>` | 确认后删除文件 |
| `cat <文件>` | 输出文件内容 |
| `less <文件>` | 分页查看文件 |
| `tail -f <日志>` | 持续查看新增日志 |
| `grep -RIn '<文本>' <目录>` | 在目录中递归搜索文本 |
| `find <目录> -name '<模式>'` | 按名称查找文件 |
| `df -h` | 查看各文件系统剩余空间 |
| `du -sh <目录>` | 查看目录占用空间 |
| `ps aux` | 查看全部进程 |
| `top` | 动态查看进程和资源占用 |
| `kill <PID>` | 请求进程正常退出 |
| `ip -brief address` | 简洁显示网卡和 IP 地址 |
| `ss -lntup` | 查看监听端口和相关进程 |
| `curl -I <URL>` | 查看 HTTP 响应头 |
| `ssh <用户>@<主机>` | 登录远程主机 |
| `tar -czf <包名>.tar.gz <目录>` | 创建 gzip 压缩包 |
| `sudo systemctl status <服务>` | 查看 systemd 服务状态 |
| `sudo journalctl -u <服务> -f` | 持续查看服务日志 |

## 获取帮助

遇到陌生命令或参数时，先查本机手册。手册与当前安装版本通常最匹配。

```bash
# 查看命令手册；按 / 搜索，按 n 跳到下一个结果，按 q 退出
man ls

# 搜索与关键词有关的手册
man -k network

# 查看简要参数说明
ls --help

# 判断命令来自可执行文件、Shell 内建命令、函数还是别名
type cd
type -a python

# 查找将被执行的程序路径
command -v git
```

Bash 内建命令（例如 `cd`、`export`、`history`）可以使用 `help`：

```bash
help cd
help export
```

## 目录与路径

```bash
# 显示当前目录的绝对路径
pwd

# 列出文件；-a 包含隐藏文件，-l 显示详情，-h 显示易读大小
ls -lah

# 按修改时间倒序排列，最近修改的文件在前
ls -lht

# 进入目录
cd /var/log

# 回到上一次所在目录
cd -

# 回到当前用户的主目录
cd

# 递归创建多层目录
mkdir -p project/src/components

# 删除空目录
rmdir empty-directory

# 获取规范化后的绝对路径
realpath ./relative/path
```

几个常用路径符号：

- `.`：当前目录。
- `..`：上一级目录。
- `~`：当前用户主目录。
- `/`：根目录。
- `-`：对 `cd` 来说表示上一次所在目录。

## 文件与目录操作

```bash
# 创建空文件，文件存在时只更新时间戳
touch notes.txt

# 复制文件
cp source.txt backup.txt

# 复制目录，并尽量保留权限、时间戳和符号链接等属性
cp -a source-directory backup-directory

# 移动文件，或给文件重命名
mv old-name.txt new-name.txt

# 覆盖目标前询问
cp -i source.txt target.txt
mv -i old-name.txt new-name.txt

# 删除文件，删除前询问
rm -i notes.txt

# 递归删除目录，执行前务必确认路径
rm -r old-directory

# 创建符号链接：先写目标，再写链接名
ln -s /opt/app/current app-current

# 查看文件类型和编码等信息
file archive.tar.gz

# 查看大小、权限、inode 和时间戳等元数据
stat notes.txt
```

> `rm` 默认不会进入回收站。`rm -rf` 会递归、强制删除且通常不可恢复，使用变量、通配符或 `sudo` 时尤其要谨慎。可以先用 `ls` 检查同一个路径，再执行删除。

GNU Coreutils 官方手册集中说明了 `ls`、`cp`、`mv`、`rm`、`mkdir`、`chmod`、`df`、`du`、`sort`、`wc` 等基础工具，完整参数可查 [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html)。

## 查看文件与日志

```bash
# 输出整个文件，适合较短内容
cat config.ini

# 带行号输出
cat -n config.ini

# 分页查看大文件；按 / 搜索，按 q 退出
less access.log

# 查看开头 20 行
head -n 20 access.log

# 查看末尾 100 行
tail -n 100 access.log

# 持续显示文件末尾的新内容，Ctrl+C 退出
tail -f app.log

# 文件被日志轮转后也继续按文件名追踪
tail -F app.log
```

`less` 比 `cat` 更适合大文件，因为它不会一次把所有内容刷到终端中。

## 搜索文件和文本

### 使用 `grep` 搜索内容

```bash
# 在文件中搜索文本
grep 'ERROR' app.log

# 忽略大小写，并显示行号
grep -in 'error' app.log

# 递归搜索当前目录，显示文件名和行号
grep -RIn 'TODO' .

# 搜索完整单词
grep -Rw 'timeout' config/

# 排除 .git 目录
grep -RIn --exclude-dir=.git 'password' .

# 显示匹配行前后各 2 行
grep -C 2 'Exception' app.log

# 只显示不匹配的行
grep -v '^#' app.conf
```

正则表达式和全部选项可查看 [GNU Grep 官方手册](https://www.gnu.org/software/grep/manual/)。

### 使用 `find` 搜索文件

```bash
# 按名称搜索，通配符需要加引号，避免先被 Shell 展开
find . -type f -name '*.log'

# 忽略名称大小写
find . -type f -iname 'readme*'

# 查找大于 100 MiB 的文件
find /var -type f -size +100M

# 查找最近 7 天内修改的普通文件
find . -type f -mtime -7

# 查找空文件
find . -type f -empty

# 对每个结果执行命令；{} 代表找到的路径
find . -type f -name '*.log' -exec ls -lh {} \;
```

先让 `find` 打印并确认结果，再添加 `-delete` 或有修改作用的 `-exec`。`find`、`locate` 和 `xargs` 的完整说明见 [GNU Findutils 官方手册](https://www.gnu.org/software/findutils/manual/html_mono/find.html)。

## 文本处理与统计

```bash
# 统计行数、单词数和字节数
wc app.log
wc -l app.log

# 排序；-n 按数字排序，-r 倒序
sort names.txt
sort -nr scores.txt

# 对相邻重复行计数，通常先排序
sort access.log | uniq -c | sort -nr

# 取冒号分隔文本的第 1 列
cut -d ':' -f 1 /etc/passwd

# 把小写转换为大写
printf 'linux\n' | tr '[:lower:]' '[:upper:]'

# 输出第 10 到 20 行
sed -n '10,20p' app.log

# 按空白分列，输出第 1、3 列
awk '{print $1, $3}' data.txt
```

一个实用组合：统计访问日志中出现次数最多的客户端 IP。这里假设 IP 位于每行第一列。

```bash
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head
```

## 管道与重定向

Shell 可以把一个命令的输出交给另一个命令，或者保存到文件。

| 写法 | 含义 |
| --- | --- |
| `command1 \| command2` | 把前一个命令的标准输出交给后一个命令 |
| `command > file` | 覆盖写入标准输出 |
| `command >> file` | 追加写入标准输出 |
| `command 2> error.log` | 把标准错误写入文件 |
| `command > all.log 2>&1` | 把标准输出和标准错误写入同一文件 |
| `command < input.txt` | 从文件读取标准输入 |
| `command \| tee file` | 同时显示并写入文件 |

```bash
# 从进程列表中筛选 nginx
ps aux | grep '[n]ginx'

# 覆盖保存输出
ip address > network-info.txt

# 追加日志
date >> deploy.log

# 同时在终端显示并保存
df -h | tee disk-usage.txt

# 需要管理员权限时，让 tee 负责写入目标文件
printf 'example\n' | sudo tee /etc/example.conf
```

`sudo command > /etc/file` 只会提升 `command` 的权限，重定向仍由当前 Shell 执行，所以写系统文件时常使用 `sudo tee`。管道、引用、展开和重定向的准确规则可查 [Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)。

## 用户、权限与所有权

```bash
# 查看当前用户名、UID、GID 和所属组
whoami
id

# 查看当前已登录用户
who

# 查看文件权限
ls -l script.sh

# 给文件所有者增加执行权限
chmod u+x script.sh

# 常见权限：所有者可读写，组和其他用户只读
chmod 644 config.ini

# 常见权限：所有者可读写执行，组和其他用户可读执行
chmod 755 script.sh

# 修改所有者和所属组
sudo chown appuser:appgroup app.log

# 递归修改目录所有权，执行前确认目标目录
sudo chown -R appuser:appgroup /srv/app
```

权限数字由 `r=4`、`w=2`、`x=1` 相加得到，三位依次对应所有者、组和其他用户。例如 `640` 表示 `rw-r-----`。

不要为了“解决权限问题”直接使用 `chmod -R 777`。这会让所有用户都能读、写和执行目标，应先确认真正需要访问的用户、组和最小权限。

## 进程与任务管理

```bash
# 查看全部进程
ps aux

# 按名称和完整命令行查找进程
pgrep -af nginx

# 动态查看进程、CPU 和内存占用，按 q 退出
top

# 请求进程正常终止，默认发送 SIGTERM
kill <PID>

# 重新加载配置；仅适用于支持 SIGHUP 的程序
kill -HUP <PID>

# 强制结束进程，只在进程无法正常退出时使用
kill -KILL <PID>

# 查看当前 Shell 的后台任务
jobs -l

# 把任务放到后台继续运行
bg %1

# 把后台任务调回前台
fg %1

# 退出终端后继续运行，并保存输出
nohup ./server > server.log 2>&1 &
```

优先使用默认的 `kill <PID>`，给程序清理资源和保存数据的机会。`SIGKILL`（`kill -9`）不能被进程捕获或延迟处理，应作为最后手段。

## 系统与硬件信息

```bash
# 查看内核、主机名和架构等信息
uname -a

# 查看发行版信息
cat /etc/os-release

# 查看主机信息；适用于使用 systemd 的系统
hostnamectl

# 查看开机时长和平均负载
uptime

# 查看内存和 Swap 使用情况
free -h

# 查看 CPU 信息
lscpu

# 查看块设备、文件系统和挂载点
lsblk -f

# 查看当前时间
date

# 查看时区和时间同步状态
timedatectl

# 查看最近的内核消息；普通用户权限可能受限
dmesg --level=err,warn
```

## 磁盘与目录空间

```bash
# 查看文件系统容量和可用空间
df -h

# 同时显示文件系统类型
df -hT

# 查看 inode 使用情况
df -i

# 查看一个目录的总大小
du -sh /var/log

# 查看当前目录下一层各项大小，并按大小排序
du -h --max-depth=1 . | sort -h

# 查看挂载关系
findmnt

# 查看块设备、UUID、文件系统和挂载点
lsblk -f
```

`df` 统计文件系统整体空间，`du` 统计目录树中可见文件占用的空间。已删除但仍被进程打开的文件，可能造成两者结果明显不同，此时可以使用 `sudo lsof +L1` 查找。

## 网络诊断

```bash
# 简洁显示网络接口、状态和地址
ip -brief address

# 查看路由表和默认网关
ip route

# 连续发送 4 个 ICMP 请求
ping -c 4 example.com

# 查看 TCP、UDP 监听端口和相关进程
sudo ss -lntup

# 查询域名的 DNS 记录
dig example.com

# 查看 HTTP 响应头
curl -I https://example.com

# 请求接口，失败时返回非零状态并显示响应内容
curl --fail-with-body https://api.example.com/health

# 显示本次请求的连接过程
curl -v https://example.com
```

常用网络命令参数含义：`ss -lntup` 中 `l` 表示监听、`n` 表示不解析名称、`t` 表示 TCP、`u` 表示 UDP、`p` 表示进程。curl 的完整参数以 [curl 官方手册](https://curl.se/docs/manpage.html) 为准。

## 下载、远程登录与文件传输

```bash
# 下载文件，保留服务器端文件名；-f 在 HTTP 错误时失败
curl -fLO https://example.com/archive.tar.gz

# 使用 wget 下载文件
wget https://example.com/archive.tar.gz

# 远程登录
ssh user@example.com

# 使用指定端口登录
ssh -p 2222 user@example.com

# 上传本地文件
scp report.txt user@example.com:/tmp/

# 下载远程目录
scp -r user@example.com:/srv/reports ./reports

# 同步目录内容，并显示进度
rsync -av --progress ./dist/ user@example.com:/srv/www/
```

`rsync` 源目录末尾的 `/` 很重要：`./dist/` 表示同步目录内的内容，`./dist` 通常表示把 `dist` 目录本身放进目标目录。SSH 和 SCP 的准确参数可查看 OpenSSH 项目的 [`ssh(1)`](https://man.openbsd.org/ssh.1) 与 [`scp(1)`](https://man.openbsd.org/scp.1) 官方手册。

## 压缩与解压

```bash
# 创建 .tar.gz 压缩包
tar -czf project.tar.gz project/

# 不解压，先查看压缩包内容
tar -tzf project.tar.gz

# 解压 .tar.gz 到当前目录
tar -xzf project.tar.gz

# 解压到指定目录；目标目录需要提前存在
mkdir -p restore
tar -xzf project.tar.gz -C restore

# 创建和解压未压缩的 .tar 归档
tar -cf project.tar project/
tar -xf project.tar

# zip 格式
zip -r project.zip project/
unzip project.zip -d restore/
```

`tar` 常用操作字母：`c` 创建、`x` 解包、`t` 列出内容、`f` 指定文件、`z` 使用 gzip、`v` 显示详细过程。更多格式、参数以及从不可信归档解压时的安全注意事项，见 [GNU tar 官方手册](https://www.gnu.org/software/tar/manual/tar.html)。

## 软件包管理

发行版使用的软件包管理器不同，不要混用以下命令。

### Debian 与 Ubuntu：APT

```bash
# 更新本地软件包索引
sudo apt update

# 升级已安装的软件包
sudo apt upgrade

# 搜索、查看、安装和删除软件包
apt search <关键词>
apt show <包名>
sudo apt install <包名>
sudo apt remove <包名>

# 删除已不再需要的依赖
sudo apt autoremove
```

官方说明：[Ubuntu Server 软件包管理文档](https://ubuntu.com/server/docs/how-to/software/package-management/)。交互使用推荐 `apt`；编写非交互脚本时，Ubuntu 官方建议使用接口更稳定的 `apt-get`。

### Fedora、RHEL 系：DNF

```bash
# 搜索、查看、安装和删除软件包
dnf search <关键词>
dnf info <包名>
sudo dnf install <包名>
sudo dnf remove <包名>

# 升级系统中的软件包
sudo dnf upgrade

# 删除不再需要的依赖
sudo dnf autoremove
```

官方说明：[DNF Command Reference](https://dnf.readthedocs.io/en/stable/command_ref.html)。

### Arch Linux：pacman

```bash
# 同步数据库并完整升级系统
sudo pacman -Syu

# 搜索、安装和删除软件包
pacman -Ss <关键词>
sudo pacman -S <包名>
sudo pacman -Rs <包名>

# 查询本机已安装的软件包
pacman -Q
```

官方说明：[ArchWiki：pacman](https://wiki.archlinux.org/title/Pacman)。Arch Linux 不支持部分升级，不要使用 `pacman -Sy <包名>` 代替完整的 `pacman -Syu` 更新流程。

## systemd 服务与日志

以下命令适用于使用 systemd 的发行版。

```bash
# 查看服务状态
systemctl status nginx.service

# 启动、停止、重启和重新加载配置
sudo systemctl start nginx.service
sudo systemctl stop nginx.service
sudo systemctl restart nginx.service
sudo systemctl reload nginx.service

# 设置开机启动并立即启动
sudo systemctl enable --now nginx.service

# 取消开机启动并立即停止
sudo systemctl disable --now nginx.service

# 查看正在运行的服务
systemctl list-units --type=service --state=running

# 查看本次启动以来某服务的日志
journalctl -b -u nginx.service

# 持续查看某服务的新日志
journalctl -u nginx.service -f

# 查看本次启动以来 warning 及更严重的日志
journalctl -b -p warning

# 查看最近 100 行，不进入分页器
journalctl -u nginx.service -n 100 --no-pager
```

完整说明可查 systemd 官方 [`systemctl(1)`](https://www.freedesktop.org/software/systemd/man/systemctl.html) 和 [`journalctl(1)`](https://www.freedesktop.org/software/systemd/man/journalctl.html) 手册。服务名通常可以省略 `.service`，但完整写出更清楚。

## Shell 中的几个实用技巧

```bash
# 查看历史命令
history

# 反向搜索历史命令
# 按 Ctrl+R 后输入关键词，再按 Ctrl+R 查找更早的匹配项

# 查看上一条命令的退出状态；0 通常表示成功
echo $?

# 只有前一条成功才继续
command1 && command2

# 只有前一条失败才执行
command1 || command2

# 临时设置环境变量，只影响这一条命令
APP_ENV=production ./server

# 设置当前 Shell 及其子进程可见的环境变量
export APP_ENV=production

# 查看环境变量
printenv APP_ENV
```

文件名或变量可能包含空格时要加双引号：

```bash
cp "$source_file" "$target_directory/"
```

Shell 脚本中也应默认给变量引用加双引号，避免单词拆分和通配符展开造成意外结果。

## 官方资料与扩展阅读

- [GNU Coreutils 官方手册](https://www.gnu.org/software/coreutils/manual/coreutils.html)：文件、目录、权限、文本处理、磁盘统计等核心命令。
- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)：Shell 语法、引用、展开、管道、重定向和任务控制。
- [GNU Grep 官方手册](https://www.gnu.org/software/grep/manual/)：文本搜索和正则表达式。
- [GNU Findutils 官方手册](https://www.gnu.org/software/findutils/manual/html_mono/find.html)：`find`、`locate` 和 `xargs`。
- [GNU tar 官方手册](https://www.gnu.org/software/tar/manual/tar.html)：归档、压缩与安全解压。
- [curl 官方文档](https://curl.se/docs/)：HTTP 请求、下载和网络排查。
- [systemd 官方手册](https://www.freedesktop.org/software/systemd/man/)：服务、日志、定时器和系统管理。
- [Linux Kernel man-pages 项目](https://www.kernel.org/doc/man-pages/)：Linux 内核与 C 库接口手册。
- [Quick Reference：Linux 命令中文速查表](https://quickref.me/zh-CN/docs/linux-command.html)：适合日常快速查找和分享的中文命令清单。

