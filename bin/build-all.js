/**
 * Static build for history.electerm.org — the electerm release archive.
 *
 * Three page kinds are rendered, and only these three:
 *   /              landing page (what the site is + links into /releases/)
 *   /releases/     hub, grouped by year
 *   /releases/vX/  one download page per archived version
 * plus /404.html.
 *
 * The blog, video, FAQ and locale pages that live in the electerm.org repo are
 * intentionally not built here; this site is English-only and archive-only.
 */
import data from './data.js'
import { buildPug } from './build-bug.js'
import { jsUrl } from './js-entry.js'
import { resolve } from 'path'
import { cwd } from './common.js'
import releaseData from './release-data.js'
import fs from 'fs/promises'
import { readFileSync } from 'fs'

let cssFilename = '/index.bundle.css'

// Aggregate numbers for the landing page hero.
function homeStats (all) {
  const latest = all[0]
  const years = all.map(r => new Date(r.date).getFullYear())
  const firstYear = Math.min(...years)
  const lastYear = Math.max(...years)
  return {
    latest,
    recent: all.slice(0, 12),
    stats: {
      total: all.length,
      years: lastYear - firstYear + 1,
      firstYear,
      lastYear,
      firstVersion: all[all.length - 1].version,
      // Linux, macOS, Windows, Android, HarmonyOS, iOS
      platforms: 6
    }
  }
}

function homeDesc (stats, latest) {
  return `Complete archive of every electerm release: ${stats.total} past versions from ` +
    `${stats.firstVersion} (${stats.firstYear}) to ${latest.version} (${stats.lastYear}), each still ` +
    'downloadable for Windows, macOS, Linux, Android, HarmonyOS and iOS.'
}

async function main () {
  // Make the per-page JS entry resolver available to every rendered template
  // (it reads data/js-manifest.json, written by `npm run build-js`).
  data.jsUrl = (p) => jsUrl(p, false)

  cssFilename = '/index.bundle.css'
  try {
    const assetsPath = resolve(cwd, 'data/assets.json')
    const assets = JSON.parse(readFileSync(assetsPath, 'utf-8'))
    cssFilename = '/' + assets.css
  } catch (e) {
    console.warn('Warning: data/assets.json not found, using fallback CSS filename')
  }

  await build404Page()
  await buildHome()
  await buildReleases()

  console.log('✅ Built history.electerm.org (release archive)')
}

// Landing page: says what the site is (the electerm release archive), links
// into /releases/, and shows the newest versions.
async function buildHome () {
  const { langCode, lang } = data.langs.find(l => l.id === 'en_us')
  const h = process.env.HOST
  const { latest, recent, stats } = homeStats(releaseData.getAllReleases())

  await buildPug(resolve(cwd, 'src/views/index.pug'), resolve(cwd, 'public/index.html'), {
    ...data,
    langCode,
    lang,
    lp: '',
    faqUrl: '/faq/',
    keywords: 'electerm release history, electerm past versions, download old electerm, electerm archive, electerm versions list, terminal client downloads',
    desc: homeDesc(stats, latest),
    url: `${h}/`,
    cssUrl: cssFilename,
    latest: { ...latest, assetCount: (latest.assets || []).length },
    recent,
    stats
  })
  console.log(`Built home page (${stats.total} releases, latest ${latest.version})`)
}

async function buildReleases () {
  const { langCode, lang } = data.langs.find(l => l.id === 'en_us')
  const h = process.env.HOST

  // Hub page: /releases/
  const hubFrom = resolve(cwd, 'src/views/releases.pug')
  const hubDir = resolve(cwd, 'public/releases')
  await fs.mkdir(hubDir, { recursive: true })
  const releasesGrouped = releaseData.getReleasesByYear()
  await buildPug(hubFrom, resolve(hubDir, 'index.html'), {
    ...data,
    langCode,
    lang,
    lp: '',
    faqUrl: '/faq/',
    keywords: 'electerm, releases, past versions, download, terminal client, open source',
    desc: 'Browse all electerm releases and download any past version for Linux, macOS, Windows, Android, and HarmonyOS.',
    url: `${h}/releases/`,
    cssUrl: cssFilename,
    releasesGrouped
  })
  console.log('Built releases index')

  // Per-version pages: /releases/vX.Y.Z/
  const relFrom = resolve(cwd, 'src/views/release.pug')
  const all = releaseData.getAllReleases()
  for (const release of all) {
    const dir = resolve(cwd, `public/releases/${release.version}`)
    await fs.mkdir(dir, { recursive: true })
    await buildPug(relFrom, resolve(dir, 'index.html'), {
      ...data,
      langCode,
      lang,
      lp: '',
      faqUrl: '/faq/',
      keywords: 'electerm ' + release.version + ', download, terminal client, open source',
      desc: 'Download electerm ' + release.version + ' for Linux, macOS, Windows, Android, and HarmonyOS.',
      url: `${h}/releases/${release.version}/`,
      cssUrl: cssFilename,
      release
    })
  }
  console.log(`Built ${all.length} release pages`)
}

async function build404Page () {
  const { langCode, lang } = data.langs.find(l => l.id === 'en_us')
  const h = process.env.HOST
  const from = resolve(cwd, 'src/views/404.pug')
  const to = resolve(cwd, 'public/404.html')
  await buildPug(from, to, {
    ...data,
    langCode,
    lang,
    lp: '',
    faqUrl: '/faq/',
    keywords: lang.lang.keywords,
    desc: 'Page not found on electerm release history',
    url: `${h}/404.html`,
    cssUrl: cssFilename
  })
  console.log('✅ Built 404 page')
}

main()
