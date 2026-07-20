# Homebrew 常用命令


## Homebrew 是什么

[Homebrew](https://brew.sh/) 是一个开源包管理器，可用于 macOS、Linux 和 WSL。它可以统一完成软件的搜索、安装、升级、卸载和依赖管理。

Homebrew 中最常见的两类软件包是：

- **Formula（配方）**：通常是命令行工具、编程语言、库或后台服务，例如 `git`、`node`、`wget`、`redis`。
- **Cask（桶）**：通常是带图形界面的 macOS 应用、字体或插件，例如 `visual-studio-code`、`google-chrome`。

可以在官方的 [Homebrew Formulae](https://formulae.brew.sh/) 页面查询软件包名称、当前版本、依赖和安装命令。

## 高频命令速查

| 命令 | 用途 |
| --- | --- |
| `brew search <关键词>` | 搜索 Formula 和 Cask |
| `brew info <包名>` | 查看软件包信息 |
| `brew install <包名>` | 安装 Formula |
| `brew install --cask <包名>` | 安装 Cask |
| `brew list` | 查看已安装的软件包 |
| `brew list --versions <包名>` | 查看指定软件的已安装版本 |
| `brew update` | 更新 Homebrew 和软件包元数据 |
| `brew outdated` | 查看可升级的软件包 |
| `brew upgrade` | 升级全部未锁定的软件包 |
| `brew upgrade <包名>` | 升级指定软件包 |
| `brew uninstall <包名>` | 卸载软件包 |
| `brew cleanup --dry-run` | 预览可清理内容 |
| `brew cleanup` | 清理旧版本和过期缓存 |
| `brew services list` | 查看后台服务状态 |
| `brew doctor` | 检查 Homebrew 环境 |

## 安装 Homebrew

安装前建议先阅读官方的 [Installation 文档](https://docs.brew.sh/Installation)。在 macOS 上，如果尚未安装 Xcode Command Line Tools，可以先执行：

```bash
xcode-select --install
```

然后使用官网提供的安装脚本：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装结束后，应按照终端给出的提示配置 `brew shellenv`。Homebrew 的默认安装目录通常为：

- Apple Silicon Mac：`/opt/homebrew`
- Intel Mac：`/usr/local`
- Linux：`/home/linuxbrew/.linuxbrew`

验证安装是否成功：

```bash
brew --version
brew doctor
```

`brew doctor` 会检查系统中可能影响 Homebrew 的配置问题。它给出的部分内容只是警告；如果相关功能能够正常使用，不一定需要逐条处理。

## 获取帮助与查看环境

```bash
# 查看常用命令和帮助
brew help

# 查看某个命令的详细帮助
brew help install

# 查看版本
brew --version

# 查看 Homebrew、Ruby、Git、系统等配置信息
brew config

# 查看 Homebrew 的安装前缀
brew --prefix

# 查看全部可用命令
brew commands

# 打开完整手册
man brew
```

Homebrew 的完整命令说明也可以直接查看官方 [`brew(1)` 手册](https://docs.brew.sh/Manpage)。

## 搜索与查看软件包信息

```bash
# 同时搜索 Formula 和 Cask
brew search <关键词>

# 查看软件包介绍、版本、依赖和安装选项
brew info <包名>

# 只按 Formula 查询
brew info --formula <包名>

# 只按 Cask 查询
brew info --cask <包名>

# 在浏览器中打开软件包的项目主页
brew home <包名>
```

例如：

```bash
brew search node
brew info node
brew info --cask visual-studio-code
```

## 安装、重装与卸载

### 安装 Formula

```bash
# 安装单个命令行工具
brew install wget

# 一次安装多个软件包
brew install git node ripgrep
```

### 安装 Cask

```bash
# 安装 macOS 图形应用
brew install --cask visual-studio-code

# 一次安装多个图形应用
brew install --cask firefox iina
```

### 重装与卸载

```bash
# 重新安装软件包，常用于修复文件缺失或安装损坏
brew reinstall <包名>

# 重新安装 Cask
brew reinstall --cask <包名>

# 卸载 Formula 或 Cask
brew uninstall <包名>
brew uninstall --cask <包名>

# 卸载 Cask，并尝试删除其关联配置文件
brew uninstall --cask --zap <包名>
```

> `--zap` 可能删除与其他应用共享的文件，执行前应先用 `brew info --cask <包名>` 查看相关信息。

## 查看已安装的软件

```bash
# 列出全部已安装的软件包
brew list

# 分别列出 Formula 和 Cask
brew list --formula
brew list --cask

# 列出已安装的软件及版本
brew list --versions

# 查看指定软件的已安装版本，无需再配合 grep
brew list --versions <包名>

# 只列出手动安装、不是作为依赖安装的 Formula
brew leaves
```

## 更新与升级

`update` 和 `upgrade` 的作用不同：

- `brew update`：更新 Homebrew 自身和软件包元数据。
- `brew upgrade`：升级已经安装的软件包。

常用命令如下：

```bash
# 更新 Homebrew 和软件包元数据
brew update

# 查看哪些软件可以升级
brew outdated

# 查看 Formula 或 Cask 中可以升级的软件
brew outdated --formula
brew outdated --cask

# 升级全部未锁定的软件包
brew upgrade

# 升级指定软件包
brew upgrade <包名>

# 只升级 Cask
brew upgrade --cask
brew upgrade --cask <包名>

# 预览将要升级的软件，不执行实际升级
brew upgrade --dry-run
```

如果需要临时保持某个版本，可以锁定软件包：

```bash
# 禁止指定软件包被 brew upgrade 升级
brew pin <包名>

# 查看已锁定的软件包
brew list --pinned

# 解除锁定
brew unpin <包名>
```

锁定旧版本可能使依赖它的其他软件无法正确安装或运行，因此不建议长期锁定。

## 清理缓存与无用依赖

```bash
# 预览 cleanup 将删除的旧版本、过期下载和缓存
brew cleanup --dry-run

# 清理全部软件包的旧版本和过期缓存
brew cleanup

# 只清理指定软件包
brew cleanup <包名>

# 预览已经不再需要的依赖
brew autoremove --dry-run

# 卸载已经不再需要的依赖
brew autoremove

# 查看 Homebrew 下载缓存的位置
brew --cache
```

建议先执行带有 `--dry-run` 的命令，确认待删除内容后再真正清理。

## 查看依赖关系

```bash
# 查看指定 Formula 的依赖
brew deps <包名>

# 以树形结构显示全部依赖
brew deps --tree <包名>

# 查看哪些已安装软件依赖指定 Formula
brew uses --installed <包名>
```

在卸载底层库之前，先运行 `brew uses --installed <包名>`，可以避免误删其他软件仍在使用的依赖。

## 管理后台服务

数据库、缓存等 Formula 可以通过 `brew services` 管理。例如安装 Redis 后：

```bash
# 查看 Homebrew 管理的服务及其状态
brew services list

# 启动服务，并在当前用户登录时自动启动
brew services start redis

# 停止服务，并取消登录时自动启动
brew services stop redis

# 重启服务
brew services restart redis

# 查看指定服务的详细信息
brew services info redis
```

在 macOS 上，不带 `sudo` 时服务属于当前用户，通常已经足够。只有明确需要系统级开机服务时才考虑使用 `sudo brew services ...`。

## 管理第三方仓库 Tap

Tap 是 Homebrew 的第三方软件仓库。一般安装官方 Formula 和 Cask 时不需要手动添加 Tap。

```bash
# 查看已经添加的 Tap
brew tap

# 添加第三方 Tap
brew tap <用户或组织>/<仓库>

# 删除 Tap
brew untap <用户或组织>/<仓库>
```

添加第三方 Tap 前，应确认其来源和维护状态。Homebrew 官方的 Tap 说明见 [Taps 文档](https://docs.brew.sh/Taps)。

## 使用 Brewfile 备份和恢复软件列表

当需要迁移 Mac 或为团队统一开发环境时，可以用 `Brewfile` 记录已安装的软件。详细说明见官方的 [Homebrew Bundle 文档](https://docs.brew.sh/Brew-Bundle-and-Brewfile)。

```bash
# 将当前目录下的软件状态导出为 Brewfile
brew bundle dump --file=./Brewfile --force

# 检查 Brewfile 中的软件是否都已安装
brew bundle check --file=./Brewfile

# 按 Brewfile 安装或恢复软件
brew bundle install --file=./Brewfile
```

`Brewfile` 可以提交到 Git 仓库中，方便在新设备上恢复命令行工具、图形应用和 Tap。

## 常用维护流程

日常维护可以按照下面的顺序执行：

```bash
# 1. 更新 Homebrew 和软件包元数据
brew update

# 2. 查看可升级的软件
brew outdated

# 3. 升级软件
brew upgrade

# 4. 预览并清理旧版本和缓存
brew cleanup --dry-run
brew cleanup

# 5. 遇到异常时检查环境
brew doctor
```

## 常见问题

### 安装成功后提示 `brew: command not found`

通常是没有完成安装程序最后给出的 `shellenv` 配置。先重新查看安装输出，并将它建议的命令加入 `~/.zprofile`、`~/.zshrc` 或当前 Shell 对应的配置文件。Apple Silicon Mac 当前终端也可以临时执行：

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 如何确认一个命令来自哪个软件包

```bash
brew which-formula <命令名>
```

例如，`brew which-formula wget` 会查询提供 `wget` 命令的 Formula。

### 从哪里开始排查错误

```bash
brew update
brew doctor
brew config
```

然后查看官方的 [Troubleshooting](https://docs.brew.sh/Troubleshooting) 和 [FAQ](https://docs.brew.sh/FAQ)。提交问题时，`brew config` 的输出通常有助于说明运行环境，但公开前仍应检查是否包含不希望披露的信息。

## 官方资料

- [Homebrew 官网](https://brew.sh/)
- [Homebrew 官方文档首页](https://docs.brew.sh/)
- [安装说明](https://docs.brew.sh/Installation)
- [`brew(1)` 完整命令手册](https://docs.brew.sh/Manpage)
- [Formula 与 Cask 查询](https://formulae.brew.sh/)
- [Homebrew Bundle 与 Brewfile](https://docs.brew.sh/Brew-Bundle-and-Brewfile)
- [故障排查](https://docs.brew.sh/Troubleshooting)
- [常见问题](https://docs.brew.sh/FAQ)

