# fnm 常用命令


## fnm 是什么

[fnm（Fast Node Manager）](https://github.com/Schniz/fnm) 是一个使用 Rust 编写的 Node.js 版本管理器，支持 macOS、Linux 和 Windows。它可以在同一台电脑上安装多个 Node.js 版本，并根据不同项目的要求快速切换版本。

fnm 支持 `.node-version`、`.nvmrc`，也可以读取 `package.json` 中的 `engines.node`。如果之前使用 nvm，通常可以直接沿用项目中的 `.nvmrc` 文件。

## 安装 fnm

### macOS 或 Linux：使用 Homebrew

```bash
brew install fnm
```

升级 fnm：

```bash
brew upgrade fnm
```

### macOS 或 Linux：使用官方安装脚本

执行前需要先安装 `curl` 和 `unzip`：

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

再次运行脚本升级时，可以添加 `--skip-shell`，避免重复修改 Shell 配置：

```bash
curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
```

> fnm 官方目前建议 macOS 用户优先通过 Homebrew 安装；安装脚本在 macOS 上默认也会使用 Homebrew。

### Windows

可以选择系统中已有的包管理器：

```powershell
# Windows Package Manager
winget install Schniz.fnm

# Scoop
scoop install fnm

# Chocolatey
choco install fnm
```

更多安装方式和参数请查看官方的 [Installation](https://github.com/Schniz/fnm#installation) 说明。

## 配置 Shell

仅安装 fnm 还不够，需要让 Shell 执行 `fnm env` 输出的环境配置。官方建议明确写出 Shell 类型，这样启动稍快，也不需要在运行时推断 Shell。

### Zsh

将下面的内容加入 `~/.zshrc`：

```zsh
eval "$(fnm env --use-on-cd --shell zsh)"
```

然后执行：

```zsh
source ~/.zshrc
```

### Bash

将下面的内容加入 `~/.bashrc`：

```bash
eval "$(fnm env --use-on-cd --shell bash)"
```

### Fish

将下面的内容加入 `~/.config/fish/conf.d/fnm.fish`：

```fish
fnm env --use-on-cd --shell fish | source
```

### PowerShell

将下面的内容加入 PowerShell Profile：

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

可以通过 `$PROFILE` 查看 Profile 路径，通过以下命令创建文件：

```powershell
if (-not (Test-Path $PROFILE)) { New-Item $PROFILE -Force }
```

配置中的 `--use-on-cd` 会在进入项目目录时，根据版本文件自动切换 Node.js。fnm 官方将其列为推荐配置，详细说明见 [Configuration](https://github.com/Schniz/fnm/blob/master/docs/configuration.md)。

验证安装和环境配置：

```bash
fnm --version
fnm --help
```

## 查看可安装的 Node.js 版本

```bash
# 列出全部远端 Node.js 版本
fnm list-remote

# 只列出 LTS 版本
fnm list-remote --lts

# 从新到旧排列 LTS 版本
fnm list-remote --lts --sort desc

# 只显示最新的 LTS 版本
fnm list-remote --lts --latest

# 查看符合指定范围的最新版本
fnm list-remote --filter "22" --latest
```

`fnm ls-remote` 是 `fnm list-remote` 的别名。

## 安装 Node.js

```bash
# 安装最新的 LTS 版本
fnm install --lts

# 安装最新版，不限定是否为 LTS
fnm install --latest

# 安装指定的大版本，fnm 会解析为该系列的合适版本
fnm install 22

# 安装精确版本
fnm install 22.17.0

# 安装后立即切换到该版本
fnm install --lts --use
fnm install 22 --use
```

版本参数可以是完整版本、部分版本，也可以是 LTS 代号。日常开发通常优先选择 LTS 版本。

## 切换 Node.js 版本

```bash
# 切换到已经安装的 Node.js 22
fnm use 22

# 如果本地没有该版本，则先安装再切换
fnm use --install-if-missing 22

# 根据当前目录中的版本文件切换
fnm use

# 查看当前使用的版本
fnm current

# 同时验证 node 命令实际使用的版本
node --version
```

`fnm use` 只影响当前 Shell 会话；如果希望新终端默认使用某个版本，还需要设置默认版本。

## 设置默认版本

```bash
# 将 Node.js 22 设为默认版本
fnm default 22

# 查看当前默认版本
fnm default
```

`fnm default 22` 等价于为该版本设置名为 `default` 的别名。设置后，在没有项目版本要求时，新 Shell 会话会使用这个版本。

## 查看已安装版本

```bash
# 列出本地已经安装的 Node.js 版本和别名
fnm list

# 简写形式
fnm ls

# 查看当前正在使用的版本
fnm current
```

## 为项目固定 Node.js 版本

推荐在项目根目录提交 `.node-version` 或 `.nvmrc`，让团队成员和 CI 使用一致的 Node.js 版本。

### 使用 `.node-version`

```bash
# 把当前 Node.js 的完整版本写入文件
node --version > .node-version
```

文件内容示例：

```text
v22.17.0
```

### 使用 `.nvmrc`

```text
22
```

配置了 `fnm env --use-on-cd` 后，进入项目目录就会自动切换版本。没有配置自动切换时，可以手动执行：

```bash
# 根据版本文件安装 Node.js
fnm install

# 根据版本文件切换 Node.js
fnm use
```

如果是 monorepo，希望在子目录中也能向上查找根目录的版本文件，可以在 Shell 初始化配置中加入 `--version-file-strategy=recursive`：

```zsh
eval "$(fnm env --use-on-cd --version-file-strategy=recursive --shell zsh)"
```

在没有 `.node-version` 或 `.nvmrc` 时，当前 fnm 也会尝试解析 `package.json` 中的 `engines.node`，并选择满足 semver 范围的版本：

```json
{
  "engines": {
    "node": ">=22 <23"
  }
}
```

## 管理版本别名

别名适合为常用版本取一个容易记忆的名字：

```bash
# 将 Node.js 22 设置为 work 别名
fnm alias 22 work

# 使用该别名
fnm use work

# 删除别名
fnm unalias work
```

默认版本实际上也是一个特殊别名：

```bash
fnm alias 22 default
```

一般直接使用更直观的 `fnm default 22` 即可。

## 临时使用指定版本运行命令

`fnm exec` 可以在不改变当前 Shell 版本的情况下，临时使用指定版本执行命令：

```bash
# 使用 Node.js 22 查看版本
fnm exec --using=22 node --version

# 使用 Node.js 22 运行 npm 测试
fnm exec --using=22 npm test

# 使用版本文件指定的版本执行命令
fnm exec --using=.node-version node app.js
```

这个命令适合在脚本或 CI 中对多个 Node.js 版本进行测试。

## 卸载 Node.js 版本

```bash
# 先确认本地版本
fnm list

# 卸载指定版本
fnm uninstall 20.19.4
```

`fnm uni` 是 `fnm uninstall` 的别名。卸载时如果传入别名，fnm 会删除该别名指向的 Node.js 版本，并同时删除所有指向同一版本的别名，因此执行前应先运行 `fnm list` 确认目标。

## 生成命令补全

fnm 可以为 Bash、Zsh、Fish 和 PowerShell 输出补全脚本：

```bash
fnm completions --shell zsh
fnm completions --shell bash
fnm completions --shell fish
fnm completions --shell powershell
```

补全脚本的加载位置和方式取决于所使用的 Shell 或补全框架。

## 常用工作流

### 第一次安装 fnm

```bash
brew install fnm
fnm install --lts --use
fnm default $(fnm current)
node --version
```

其中 `fnm default $(fnm current)` 会把当前正在使用的 Node.js 版本设为默认版本。

### 进入已有项目

```bash
cd <项目目录>
fnm install
fnm use
node --version
```

如果已配置 `--use-on-cd`，进入目录时会自动切换；本地缺少项目要求的版本时，再执行一次 `fnm install` 即可。

### 创建新项目

```bash
fnm install --lts --use
node --version > .node-version
```

记得将 `.node-version` 提交到 Git 仓库。

## 常见问题

### 安装后提示 `fnm: command not found`

先重新打开终端，或者重新加载 Shell 配置：

```bash
# Zsh
source ~/.zshrc

# Bash
source ~/.bashrc
```

如果仍然找不到命令，检查 fnm 是否已加入 `PATH`，并确认安装脚本是否修改了正确的 Shell 配置文件。

### `fnm` 能运行，但 `node` 找不到或版本没有切换

通常是因为 Shell 没有执行 `fnm env` 的输出。确认 `~/.zshrc`、`~/.bashrc` 或 PowerShell Profile 中存在对应的初始化命令，然后重新打开终端。

### npm 全局包为什么不见了

不同 Node.js 版本拥有各自的全局 npm 安装目录。切换版本后，之前通过 `npm install -g` 安装的命令不一定存在，需要在新版本下重新安装。项目依赖应保存在 `package.json` 中，通过 `npm install`、`npm ci`、`pnpm install` 或 `yarn install` 恢复。

## 常用命令速查

| 命令 | 用途 |
| --- | --- |
| `fnm list-remote --lts --sort desc` | 查看可安装的 LTS 版本 |
| `fnm install --lts --use` | 安装并立即使用最新 LTS |
| `fnm install 22` | 安装 Node.js 22 系列 |
| `fnm use 22` | 在当前 Shell 切换到 Node.js 22 |
| `fnm use --install-if-missing 22` | 缺少版本时自动安装并切换 |
| `fnm default 22` | 设置新 Shell 默认使用的版本 |
| `fnm list` | 查看本地已安装版本和别名 |
| `fnm current` | 查看当前使用的 Node.js 版本 |
| `fnm install` | 根据项目版本文件安装 |
| `fnm use` | 根据项目版本文件切换 |
| `fnm exec --using=22 <命令>` | 临时使用指定版本运行命令 |
| `fnm uninstall <版本>` | 卸载指定 Node.js 版本 |

## 官方资料

- [fnm 官方 GitHub 仓库与安装说明](https://github.com/Schniz/fnm)
- [fnm 完整命令参考](https://github.com/Schniz/fnm/blob/master/docs/commands.md)
- [fnm 配置说明](https://github.com/Schniz/fnm/blob/master/docs/configuration.md)
- [fnm Releases](https://github.com/Schniz/fnm/releases)
- [Node.js 官方版本发布列表](https://nodejs.org/en/about/previous-releases)

