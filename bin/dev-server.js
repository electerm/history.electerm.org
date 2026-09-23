import logger from 'morgan'
import { viewPath, env, staticPath, cwd } from './common.js'
import data from './data.js'
import { jsUrl } from './js-entry.js'
import express from 'express'
import stylus from 'stylus'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import releaseData from './release-data.js'

// Minimal dev server for the release archive. Production is a pure-static
// Cloudflare site serving the landing page (/), the releases hub (/releases/)
// and the per-version download pages, plus the 404 page — dev mirrors exactly
// that: no blog, videos or FAQ routes.

const devPort = env.SERVER_DEV_PORT || 6068
const host = env.SERVER_HOST || '127.0.0.1'
const h = `http://${host}:${devPort}`

const enLang = data.langs.find(l => l.slug === '') || data.langs[0]

// Override locale URLs to use the dev host
data.langs = data.langs.map(l => ({
  ...l,
  url: l.slug === '' ? h : h + '/' + l.slug + '/'
}))

// Make the per-page JS entry resolver available to every rendered template.
data.jsUrl = (p) => jsUrl(p, true)

// Compile stylus to CSS
function compileStylus () {
  const files = [
    'src/css/basic.styl',
    'src/css/home.styl'
  ]
  let css = ''
  for (const file of files) {
    const filePath = resolve(cwd, file)
    const content = readFileSync(filePath, 'utf-8')
    const compiled = stylus(content)
      .set('filename', filePath)
      .set('compress', false)
      .render()
    css += compiled + '\n'
  }
  return css
}

function handleHome (req, res) {
  const { langCode, lang } = enLang
  const h = `http://${host}:${devPort}`
  const all = releaseData.getAllReleases()
  const latest = all[0]
  const years = all.map(r => new Date(r.date).getFullYear())
  const firstYear = Math.min(...years)
  const lastYear = Math.max(...years)
  const stats = {
    total: all.length,
    years: lastYear - firstYear + 1,
    firstYear,
    lastYear,
    firstVersion: all[all.length - 1].version,
    platforms: 6
  }
  const recent = all.slice(0, 12)
  const assetCount = (latest.assets || []).length

  res.render('index', {
    ...data,
    host: h,
    url: h + '/',
    dev: true,
    cssUrl: '/index.bundle.css',
    langCode,
    lang,
    lp: '',
    faqUrl: '/faq/',
    keywords: 'electerm release history, electerm past versions, download old electerm, electerm archive, electerm versions list, terminal client downloads',
    desc: `Complete archive of every electerm release: ${stats.total} past versions from ` +
      `${stats.firstVersion} (${stats.firstYear}) to ${latest.version} (${stats.lastYear}), each still ` +
      'downloadable for Windows, macOS, Linux, Android, HarmonyOS and iOS.',
    latest: { ...latest, assetCount },
    recent,
    stats
  })
}

function handleReleasesIndex (req, res) {
  const { langCode, lang } = enLang
  const releasesGrouped = releaseData.getReleasesByYear()
  res.render('releases', {
    ...data,
    host: h,
    url: h + '/releases/',
    dev: true,
    cssUrl: '/index.bundle.css',
    langCode,
    lang,
    lp: '',
    faqUrl: '/faq/',
    keywords: 'electerm, releases, past versions, download, terminal client, open source',
    desc: 'Browse all electerm releases and download any past version for Linux, macOS, Windows, Android, and HarmonyOS.',
    releasesGrouped
  })
}

function handleRelease (req, res) {
  const { langCode, lang } = enLang
  const version = req.params.version
  const release = releaseData.getRelease(version)
  if (!release) {
    res.status(404).send('Release not found')
    return
  }
  res.render('release', {
    ...data,
    host: h,
    url: h + '/releases/' + version + '/',
    dev: true,
    cssUrl: '/index.bundle.css',
    langCode,
    lang,
    lp: '',
    faqUrl: '/faq/',
    keywords: 'electerm ' + version + ', download, terminal client, open source',
    desc: 'Download electerm ' + version + ' for Linux, macOS, Windows, Android, and HarmonyOS.',
    release
  })
}

function createServer () {
  const app = express()

  // Make the trailing slash significant: "/releases" redirects to the hub while
  // "/releases/" renders it. Without this, Express treats them as one pattern
  // and the redirect would shadow the hub.
  app.enable('strict routing')

  app.use(logger('tiny'))
  app.use(express.json())
  app.use(express.urlencoded({
    extended: true
  }))

  app.use(express.static(staticPath))
  // Serve the unbundled source JS modules in dev (native ESM, no build step).
  // Never cache these during development so edits are picked up immediately.
  app.use('/js-src', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use('/js-src', express.static(resolve(cwd, 'src/js')))
  // Dev CSS is compiled on the fly too — disable caching for it as well.
  app.use('/index.bundle.css', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.set('views', viewPath)
  app.set('view engine', 'pug')

  // Serve compiled CSS
  app.get('/index.bundle.css', (req, res) => {
    try {
      const css = compileStylus()
      res.setHeader('Content-Type', 'text/css')
      res.send(css)
    } catch (err) {
      console.error('Stylus compilation error:', err)
      res.status(500).send('CSS compilation error')
    }
  })

  // Rendered pages are never cached in dev. A stale HTML shell hides every
  // template edit, and — worse — a *permanent* redirect from a dev server is
  // stored by the browser and keeps firing after the route is changed or even
  // deleted. That is exactly how the old `/` -> `/releases/` rule outlived its
  // removal here. So: no-store on every page, and 302 (never 301) for any
  // redirect this server issues. Production uses src/static/_redirects instead,
  // where the permanent status is correct.
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Landing page + release archive routes (historical download pages).
  // "/releases" still redirects to the canonical trailing-slash hub URL.
  app.get('/', handleHome)
  app.get('/releases', (req, res) => res.redirect(302, '/releases/'))

  // Release archive routes (historical download pages)
  app.get('/releases/', handleReleasesIndex)
  app.get('/releases/:version', handleRelease)
  app.get('/releases/:version/', handleRelease)

  app.listen(devPort, host, () => {
    console.log(`server started at ${h}`)
  })
}

createServer()
