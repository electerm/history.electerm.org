import { config } from 'dotenv'
import { resolve } from 'path'
import { cwd } from './common.js'
import fs from 'fs'

config()

// The archive is English-only: one locale, no language switcher and no
// per-language URLs. `langs` is kept as an array of one so the build scripts
// can keep doing `data.langs.find(l => l.id === 'en_us')`.
function createLocaleData () {
  const filePath = resolve(cwd, 'src/data/en.json')
  if (!fs.existsSync(filePath)) {
    throw new Error('Missing src/data/en.json — the site copy lives there.')
  }
  return [{
    id: 'en_us',
    slug: '',
    langCode: 'en-US',
    lang: JSON.parse(fs.readFileSync(filePath, 'utf-8')),
    url: process.env.HOST
  }]
}

// There used to be a `createReleaseData()` here that described the *latest*
// release (from data/electerm-github-release.json, written by the removed
// `npm run down`). Nothing in this fork ever consumed it: the archive is driven
// by src/release-data/*.json via bin/release-data.js, and that JSON file was
// gitignored and never produced in CI, so the function always returned `{}`.
// Its one visible effect was a permanently-dead GitHub star badge in the header,
// whose data source could not exist here. Removed along with the badge.

export default {
  desc: 'Free and open-sourced terminal/ssh/sftp/telnet/serialport/RDP/VNC/Spice/ftp client (linux, mac, win, android, harmony, ios)',
  siteName: 'electerm',
  host: process.env.HOST,
  // Icons are not duplicated in this repo. `favicon.ico`, the PNG favicons, the
  // apple-touch-icon, the android-chrome sizes and `electerm.png` are
  // electerm.org's own files, referenced here by absolute URL so there is exactly
  // one copy to keep current. electerm.org serves them with
  // `Access-Control-Allow-Origin: *`, so cross-origin use is allowed.
  // Keep these filenames in sync with that site's src/static/.
  assetHost: 'https://electerm.org',
  langs: createLocaleData(),
  // The one and only link list. `src/views/parts/links.pug` renders these
  // grouped by category; the old flat `links` array (and the `refs`/`videos`
  // blobs it came with) belonged to pages this fork does not build.
  linkCategories: [
    {
      key: 'Official',
      links: [
        { title: 'electerm.org — latest release, docs, support', url: 'https://electerm.org/', external: true },
        { title: 'GitHub Repository', url: 'https://github.com/electerm/electerm', external: true },
        { title: 'All releases (this archive)', url: '/releases/' },
        { title: 'Wiki & Documentation', url: 'https://github.com/electerm/electerm/wiki', external: true },
        { title: 'Command Line Usage', url: 'https://github.com/electerm/electerm/wiki/Command-line-usage', external: true },
        { title: 'Deep Link Support', url: 'https://github.com/electerm/electerm/wiki/Deep-link-support', external: true },
        { title: 'Known Issues', url: 'https://github.com/electerm/electerm/wiki/Know-issues', external: true },
        { title: 'Troubleshooting', url: 'https://github.com/electerm/electerm/wiki/Troubleshoot', external: true },
        { title: 'Discussions', url: 'https://github.com/electerm/electerm/discussions', external: true }
      ]
    },
    {
      key: 'Ecosystem',
      links: [
        { title: 'Electerm Online', url: 'https://cloud.electerm.org', external: true },
        { title: 'APT Repository', url: 'https://repos.electerm.org/deb', external: true },
        { title: 'RPM Repository', url: 'https://repos.electerm.org/rpm', external: true },
        { title: 'electerm-web', url: 'https://github.com/electerm/electerm-web', external: true },
        { title: 'electerm-web-docker', url: 'https://github.com/electerm/electerm-web-docker', external: true },
        { title: 'electerm-locales', url: 'https://github.com/electerm/electerm-locales', external: true },
        { title: 'electerm cloud', url: 'https://sync.electerm.org/', external: true },
        { title: 'electerm AI — Free AI for electerm users', url: 'https://ai.electerm.org', external: true },
        { title: 'electerm theme — Create/share theme site with live preview and AI creation', url: 'https://theme.electerm.org', external: true },
        { title: 'electerm-android', url: 'https://github.com/electerm/electerm-android', external: true },
        { title: 'electerm-harmony (HarmonyOS)', url: 'https://github.com/electerm/electerm-harmony', external: true },
        { title: 'electerm on AppGallery (HarmonyOS)', url: 'https://appgallery.huawei.com/app/detail?id=org.electerm.electerm', external: true },
        { title: 'electerm-ios (iOS)', url: 'https://github.com/electerm/electerm-ios', external: true },
        { title: 'electerm on Apple App Store (iOS)', url: 'https://apps.apple.com/cn/app/electerm/id6792971552', external: true }
      ]
    },
    {
      key: 'Community',
      links: [
        { title: 'Sponsor Electerm', url: 'https://electerm.org/sponsor-electerm/', external: true },
        { title: 'Video Guides', url: 'https://electerm.org/videos/', external: true },
        { title: 'Blog', url: 'https://electerm.org/blogs/', external: true },
        { title: 'Windows Store', url: 'https://www.microsoft.com/store/apps/9NCN7272GTFF', external: true },
        { title: 'Snap Store', url: 'https://snapcraft.io/electerm', external: true },
        { title: 'Apple App Store', url: 'https://apps.apple.com/cn/app/electerm/id6792971552', external: true }
      ]
    }
  ]
}
