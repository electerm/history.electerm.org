[中文](./README_cn.md)

<h1 class="aligncenter">
    <a href="https://history.electerm.org">
        <img src="https://cdn.jsdelivr.net/gh/electerm/electerm-resource@master/static/images/electerm.png", alt="electerm" />
    </a>
</h1>

# history.electerm.org

The electerm release archive: [https://history.electerm.org](https://history.electerm.org).

Every electerm release ever published is kept here — 582 versions from 2017-11-29 to
2026-09-21 — each with its original release notes and its original download files, so
any past version stays downloadable after it has been superseded.

This is **not** the electerm product site. The current release, documentation and
support live at [https://electerm.org](https://electerm.org).

## About electerm

electerm is an open-source terminal / SSH / SFTP / FTP / Telnet / serialport / RDP / VNC / Spice client, supporting Linux, macOS, Windows, Android, HarmonyOS, and iOS.

Besides the mainstream Windows / macOS / Linux / Android platforms, electerm also supports HarmonyOS, iOS, and older systems such as Ubuntu 18, Windows 7, macOS 10+, as well as domestic Linux distributions like UOS, Kylin, and LoongArch (both old-world and new-world), as well as RISC-V (riscv64) and PowerPC 64-bit little-endian (ppc64le) Linux.

## Key Features

- Works as a terminal / file manager or an SSH / SFTP / FTP / Telnet / serialport / RDP / VNC / Spice client
- Supports Windows 7+ (X64/ARM64), HarmonyOS, Android, iOS, macOS 10.15+ (X64/arm64), Linux (X64/arm64/armv7/LoongArch64/RISC-V/ppc64le), and even older systems with glibc 2.17+
- Global hotkey to toggle window visibility (similar to guake, default `ctrl + 2`)
- Multi-platform support (Linux / macOS / Windows)
- Multi-language support (Chinese, English, Japanese, Korean, Russian, Spanish, French, and more)
- Double-click to directly edit small remote files
- Public key + password authentication
- Zmodem (rz, sz) and Trzsz (trz/tsz) support
- SSH tunnel and global / session proxy support
- Terminal background image and transparent window
- Quick commands, UI / terminal themes
- Sync bookmarks / themes / quick commands to GitHub / Gitee secret gist, WebDAV, a custom server, or electerm cloud
- Integrated AI assistant for command suggestions, script writing, explaining selected content, and creating bookmarks / themes
- MCP (Model Context Protocol) widget for AI assistant and external tool integration
- Deep link support, e.g. `ssh://user@host:22`, `telnet://192.168.2.31:34554`
- Command-line usage

## Sub-projects and Related Links

- Homepage / Downloads: [https://electerm.org](https://electerm.org)
- Theme live editor, live preview & sharing: [https://theme.electerm.org](https://theme.electerm.org)
- Online demo: [https://demo.electerm.org](https://demo.electerm.org)
- electerm online (free cloud app): [https://cloud.electerm.org](https://cloud.electerm.org)
- electerm AI: [https://ai.electerm.org](https://ai.electerm.org)
- electerm-web (browser version, including mobile): [https://github.com/electerm/electerm-web](https://github.com/electerm/electerm-web)
- electerm-android: [https://github.com/electerm/electerm-android](https://github.com/electerm/electerm-android)
- electerm-harmony (HarmonyOS): [https://github.com/electerm/electerm-harmony](https://github.com/electerm/electerm-harmony)
- electerm-ios (iOS): [https://github.com/electerm/electerm-ios](https://github.com/electerm/electerm-ios)
- Docker deployment: [https://github.com/electerm/electerm-web-docker](https://github.com/electerm/electerm-web-docker)
- Locales: [https://github.com/electerm/electerm-locales](https://github.com/electerm/electerm-locales)
- App stores
  - Apple App Store: [https://apps.apple.com/cn/app/electerm/id6792971552](https://apps.apple.com/cn/app/electerm/id6792971552)
  - Huawei AppGallery: [https://appgallery.huawei.com/app/detail?id=org.electerm.electerm](https://appgallery.huawei.com/app/detail?id=org.electerm.electerm)
  - Microsoft Store: [https://www.microsoft.com/store/apps/9NCN7272GTFF](https://www.microsoft.com/store/apps/9NCN7272GTFF)
  - Snap Store: [https://snapcraft.io/electerm](https://snapcraft.io/electerm)
- Package repositories
  - deb repo: [https://repos.electerm.org/deb](https://repos.electerm.org/deb)
  - rpm repo: [https://repos.electerm.org/rpm](https://repos.electerm.org/rpm)

## Download and Install

- macOS: `brew install --cask electerm`
- Linux (snap): `sudo snap install electerm --classic`
- Windows: Microsoft Store, winget (`winget install electerm.electerm`), or scoop
- npm: `npm i -g electerm`
- For installers of each platform and detailed steps, see the official site [https://electerm.org](https://electerm.org)

## Development

Plain static output — no framework and no runtime.

```bash
npm i

# dev server: renders on the fly, no build step (default port 6068)
npm run dev

# production build -> public/
npm run b

# lint
npm run lint
```

`npm run b` writes `public/`, which is what gets deployed. To look at it locally,
serve that directory with any static server, e.g.
`python3 -m http.server -d public 8080`.

### How it fits together

- `src/views/*.pug` → HTML, built by `bin/build-all.js`. Only three page kinds
  exist: `/`, `/releases/`, `/releases/<version>/`, plus `404.html`.
- `src/css/*.styl` → one hashed stylesheet, built by `bin/build-css.js`.
- `src/js/pages/*.js` → hashed bundles recorded in `data/js-manifest.json`, built
  by `bin/build-js.js`.
- `src/release-data/*.json` → the archive data itself, one file per release, synced
  from upstream GitHub releases by `bin/sync-release-data.sh` (run in CI).

Deployment is Cloudflare Workers static assets (`wrangler.toml`, no worker script);
the CI workflow builds the site and runs `wrangler deploy`.

## License

MIT
