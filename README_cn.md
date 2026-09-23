[English](./README.md)

<h1 class="aligncenter">
    <a href="https://history.electerm.org">
        <img src="https://cdn.jsdelivr.net/gh/electerm/electerm-resource@master/static/images/electerm.png", alt="electerm" />
    </a>
</h1>

# history.electerm.org

electerm 历史版本归档站：[https://history.electerm.org](https://history.electerm.org)。

这里保存了 electerm 发布过的所有版本 —— 自 2017-11-29 至 2026-09-21 共 582 个版本 —— 每个版本都保留了当时的更新日志和原始安装包，因此在版本被新版本取代之后，旧版本依然可以下载。

本仓库**不是** electerm 官网。最新版本、文档与技术支持见 [https://electerm.org](https://electerm.org)。

## 关于 electerm

electerm 是一款开源的终端 / SSH / SFTP / FTP / Telnet / 串口 / RDP / VNC / Spice 客户端，支持 Linux、macOS、Windows、Android、HarmonyOS 与 iOS 等平台。

除主流的 Windows / macOS / Linux / Android 外，electerm 还支持 HarmonyOS、iOS，以及较老的系统，如 Ubuntu 18、Windows 7、macOS 10+，以及 UOS、麒麟、龙架构（LoongArch，新旧世界）等国产 Linux 发行版，以及 RISC-V（riscv64）和 PowerPC 64 位小端（ppc64le）Linux。

## 核心特性

- 可作为终端 / 文件管理器，或 SSH / SFTP / FTP / Telnet / 串口 / RDP / VNC / Spice 客户端使用
- 支持 Windows 7+（X64/ARM64）、HarmonyOS、Android、iOS、macOS 10.15+（X64/arm64）、Linux（X64/arm64/armv7/LoongArch64/RISC-V/ppc64le）等，甚至兼容 glibc 2.17+ 的老系统
- 全局快捷键切换窗口显隐（类似 guake，默认 `ctrl + 2`）
- 多平台支持（Linux / macOS / Windows）
- 多语言支持（含中、英、日、韩、俄、西、法等十余种语言）
- 双击直接编辑远程小文件
- 公钥 + 密码认证
- 支持 Zmodem（rz、sz）与 Trzsz（trz/tsz）
- 支持 SSH 隧道、全局 / 会话代理
- 终端背景图、透明窗口
- 快捷命令、UI / 终端主题
- 书签 / 主题 / 快捷命令可同步至 GitHub / Gitee 私密 Gist、WebDAV、自定义服务器或 electerm 云
- 集成 AI 助手，辅助命令建议、脚本编写、解释选中内容、创建书签与主题
- 支持 MCP（Model Context Protocol）组件，便于 AI 助手与外部工具集成
- 支持深链（deep link），如 `ssh://user@host:22`、`telnet://192.168.2.31:34554`
- 支持命令行调用

## 子项目与相关链接

- 官网 / 下载：[https://electerm.org](https://electerm.org)
- 主题在线编辑、实时预览与分享：[https://theme.electerm.org](https://theme.electerm.org)
- 在线演示：[https://demo.electerm.org](https://demo.electerm.org)
- electerm 在线版（云端免费）：[https://cloud.electerm.org](https://cloud.electerm.org)
- electerm AI：[https://ai.electerm.org](https://ai.electerm.org)
- electerm-web（浏览器端，含移动端）：[https://github.com/electerm/electerm-web](https://github.com/electerm/electerm-web)
- electerm-android（安卓端）：[https://github.com/electerm/electerm-android](https://github.com/electerm/electerm-android)
- electerm-harmony（鸿蒙端）：[https://github.com/electerm/electerm-harmony](https://github.com/electerm/electerm-harmony)
- electerm-ios（iOS 端）：[https://github.com/electerm/electerm-ios](https://github.com/electerm/electerm-ios)
- Docker 部署：[https://github.com/electerm/electerm-web-docker](https://github.com/electerm/electerm-web-docker)
- 多语言包：[https://github.com/electerm/electerm-locales](https://github.com/electerm/electerm-locales)
- 应用市场
  - Apple App Store：[https://apps.apple.com/cn/app/electerm/id6792971552](https://apps.apple.com/cn/app/electerm/id6792971552)
  - 华为应用市场：[https://appgallery.huawei.com/app/detail?id=org.electerm.electerm](https://appgallery.huawei.com/app/detail?id=org.electerm.electerm)
  - Microsoft Store：[https://www.microsoft.com/store/apps/9NCN7272GTFF](https://www.microsoft.com/store/apps/9NCN7272GTFF)
  - Snap Store：[https://snapcraft.io/electerm](https://snapcraft.io/electerm)
- 软件源
  - deb 源：[https://repos.electerm.org/deb](https://repos.electerm.org/deb)
  - rpm 源：[https://repos.electerm.org/rpm](https://repos.electerm.org/rpm)

## 下载与安装

- macOS：`brew install --cask electerm`
- Linux（snap）：`sudo snap install electerm --classic`
- Windows：Microsoft Store、winget（`winget install electerm.electerm`）、scoop
- npm：`npm i -g electerm`
- 各平台安装包与详细步骤见官网 [https://electerm.org](https://electerm.org)

## 开发

纯静态产物，无框架、无运行时。

```bash
npm i

# 开发服务器：实时渲染，无需构建（默认端口 6068）
npm run dev

# 生产构建 -> public/
npm run b

# 代码检查
npm run lint
```

`npm run b` 生成 `public/` 目录，也就是实际部署的内容。本地预览可用任意静态服务器，例如
`python3 -m http.server -d public 8080`。

### 项目结构

- `src/views/*.pug` → HTML，由 `bin/build-all.js` 构建。全站只有三类页面：
  `/`、`/releases/`、`/releases/<version>/`，外加 `404.html`。
- `src/css/*.styl` → 单个带哈希的样式文件，由 `bin/build-css.js` 构建。
- `src/js/pages/*.js` → 带哈希的打包文件，清单写入 `data/js-manifest.json`，
  由 `bin/build-js.js` 构建。
- `src/release-data/*.json` → 归档数据本身，每个版本一个文件，由
  `bin/sync-release-data.sh` 从上游 GitHub Release 同步（在 CI 中执行）。

部署方式为 Cloudflare Workers 静态资源（`wrangler.toml`，无 worker 脚本）；
CI 流程负责构建站点并执行 `wrangler deploy`。

## 许可证

MIT
