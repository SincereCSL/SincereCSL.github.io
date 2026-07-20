# NVM 常用命令


## NVM 是什么

[NVM（Node Version Manager）](https://github.com/nvm-sh/nvm) 是一个按用户、按 Shell 工作的 Node.js 版本管理工具。它可以在同一台电脑上安装多个 Node.js 版本，并在不同项目之间快速切换。

NVM 适用于 macOS、Linux，以及 Windows 的 WSL 环境；它不是原生 Windows 程序。日常开发建议优先使用 Node.js 的 LTS（长期支持）版本，具体支持状态可查看 [Node.js 官方版本列表](https://nodejs.org/en/about/previous-releases)。

## 安装与更新 NVM

本文编写时，NVM 的最新版本为 `v0.40.6`。安装前可以先到 [NVM Releases](https://github.com/nvm-sh/nvm/releases) 确认最新版本，再使用官方 README 中提供的脚本。

使用 `curl`：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash
```

或者使用 `wget`：

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.6/install.sh | bash
```

安装脚本会尝试把 NVM 的加载配置写入 `~/.zshrc`、`~/.bashrc`、`~/.bash_profile` 或 `~/.profile`。安装完成后，重新打开终端，或者按当前 Shell 重新加载配置：

```bash
# zsh（macOS 常见）
source ~/.zshrc

# bash（Linux 常见）
source ~/.bashrc
```

验证是否安装成功：

```bash
command -v nvm
nvm --version
```

如果第一条命令输出 `nvm`，说明 NVM 已正确加载。NVM 是 Shell 函数，不是独立的可执行文件，因此官方建议使用 `command -v nvm`，不要使用 `which nvm` 验证。

更新 NVM 时，查看 [NVM Releases](https://github.com/nvm-sh/nvm/releases) 并把上方脚本中的版本号替换为最新版，再重新执行安装脚本即可。

> NVM 官方不支持通过 Homebrew 安装的版本。遇到问题时，建议先卸载 Homebrew 版本，再按官方安装脚本重新安装。

## 最常用的命令

### 查看帮助和版本

```bash
nvm --help       # 查看帮助
nvm --version    # 查看 NVM 版本
nvm current      # 查看当前正在使用的 Node.js 版本
node --version   # 查看当前 Node.js 版本
npm --version    # 查看当前 npm 版本
```

### 查询 Node.js 版本

```bash
nvm ls                 # 查看本机已经安装的版本
nvm ls-remote          # 查看所有可以安装的远程版本
nvm ls-remote --lts    # 只查看远程 LTS 版本
nvm version 24         # 查看本地符合 24.x 的最高版本
nvm version-remote 24  # 查看远程符合 24.x 的最高版本
nvm which current      # 查看当前 Node.js 可执行文件路径
```

### 安装 Node.js

```bash
nvm install --lts       # 安装最新 LTS 版本，并立即切换过去（推荐）
nvm install node        # 安装最新 Current 版本
nvm install 24          # 安装最新的 24.x 版本
nvm install 24.18.0     # 安装指定的完整版本
nvm install             # 按当前项目的 .nvmrc 安装
```

`node` 表示最新发布版，`lts/*` 或 `--lts` 表示最新 LTS 版。生产项目通常应优先选择仍在支持期内的 LTS 版本。

### 切换 Node.js 版本

```bash
nvm use --lts     # 切换到已安装的最新 LTS 版本
nvm use 24        # 切换到已安装的最新 24.x 版本
nvm use 24.18.0   # 切换到指定的完整版本
nvm use           # 按当前项目的 .nvmrc 切换
nvm use system    # 临时切换到系统安装的 Node.js
nvm deactivate    # 取消 NVM 对当前 Shell 的 PATH 修改
```

`nvm use` 只影响当前终端会话，不会强制改变其他已经打开的终端窗口。

### 设置默认版本和别名

```bash
nvm alias default 'lts/*'  # 新终端默认使用最新 LTS 版本
nvm alias default 24       # 新终端默认使用最新的 24.x 版本
nvm alias                  # 查看全部别名
nvm alias work 22          # 创建自定义别名 work
nvm use work               # 使用自定义别名
nvm unalias work           # 删除自定义别名
```

### 卸载 Node.js

```bash
nvm uninstall 22.22.0  # 卸载指定版本
nvm uninstall 22       # 卸载匹配的 22.x 版本
```

不能直接卸载当前正在使用的版本。可以先执行 `nvm use` 切换到其他版本，再执行卸载。

### 使用指定版本运行命令

```bash
nvm exec 22 node --version  # 在 Node.js 22 环境中执行一条命令
nvm run 22 app.js           # 使用 Node.js 22 运行 app.js
nvm which 22                # 查看 Node.js 22 的可执行文件路径
```

`nvm exec` 很适合临时验证某条命令在不同 Node.js 版本下的表现，不需要先修改当前终端的默认版本。

### 缓存管理

```bash
nvm cache dir    # 查看缓存目录
nvm cache clear  # 清空下载缓存
```

通常不需要频繁清理缓存；只有下载文件损坏或需要释放磁盘空间时再使用。

## 使用 `.nvmrc` 固定项目版本

在项目根目录创建 `.nvmrc`，团队成员进入项目后就可以使用同一条命令安装或切换版本。

```bash
# 固定到 Node.js 24 主版本的最新版
printf '24\n' > .nvmrc

# 安装 .nvmrc 指定的版本
nvm install

# 以后进入项目时切换到该版本
nvm use
```

`.nvmrc` 也可以写完整版本号或 LTS 别名：

```text
24.18.0
```

或者：

```text
lts/*
```

建议把 `.nvmrc` 提交到 Git。完整版本号的环境最一致；主版本号会自动使用该主版本下已安装的最高版本；`lts/*` 会随最新 LTS 版本变化，适合希望持续跟进 LTS 的项目。

## 升级 Node.js 时迁移全局 npm 包

不同 Node.js 版本拥有各自的全局 npm 包目录。升级版本后发现全局命令“消失”，通常不是包被删除，而是新版本中还没有安装。

安装最新 LTS，并从当前版本重新安装全局包：

```bash
nvm install --reinstall-packages-from=current 'lts/*'
```

在两个已经安装的版本之间迁移全局包：

```bash
nvm use 24
nvm reinstall-packages 22
```

使用 NVM 后，全局安装 npm 包通常不需要 `sudo`：

```bash
npm install -g pnpm
```

另外，`~/.npmrc` 中不要设置 `prefix`，`NPM_CONFIG_PREFIX` 或 `PREFIX` 环境变量也可能与 NVM 冲突。

## 一套常见的项目工作流

```bash
# 1. 安装最新 LTS
nvm install --lts

# 2. 设为新终端的默认版本
nvm alias default 'lts/*'

# 3. 在项目中记录当前 Node.js 版本
node --version > .nvmrc

# 4. 其他成员拉取项目后安装并使用该版本
nvm install
nvm use
```

## 常见问题

### 安装后提示 `nvm: command not found`

先关闭并重新打开终端，或者执行 `source ~/.zshrc` / `source ~/.bashrc`。如果仍然无效，检查对应的 Shell 配置文件中是否存在 NVM 的加载代码。

### `nvm use` 提示找不到版本

`nvm use` 只能切换到已经安装的版本。先执行：

```bash
nvm install 24
nvm use 24
```

### 为什么不同终端中的 Node.js 版本不同

NVM 按 Shell 会话工作。一个终端中执行 `nvm use` 不会改变其他已经打开的终端；需要分别切换，或者通过 `nvm alias default` 设置新终端的默认版本。

## 官方资料

- [NVM 官方仓库](https://github.com/nvm-sh/nvm)
- [NVM 官方 README：安装与更新](https://github.com/nvm-sh/nvm#installing-and-updating)
- [NVM 官方 README：常用方法](https://github.com/nvm-sh/nvm#usage)
- [NVM 官方 README：`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc)
- [NVM 官方版本发布页](https://github.com/nvm-sh/nvm/releases)
- [Node.js 官方版本与 LTS 状态](https://nodejs.org/en/about/previous-releases)

