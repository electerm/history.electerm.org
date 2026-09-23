import { createSitemap } from 'sitemaps'
import { cwd } from './common.js'
import { resolve } from 'path'
import dayjs from 'dayjs'
import data from './data.js'
import releaseData from './release-data.js'

const fmt = 'YYYY-MM-DD'

async function buildSiteMap () {
  const urls = []
  const host = data.host || 'https://history.electerm.org'

  // Landing page
  urls.push({
    loc: `${host}/`,
    lastmod: dayjs().format(fmt),
    changefreq: 'weekly',
    priority: 1
  })

  // Release archive hub
  urls.push({
    loc: `${host}/releases/`,
    lastmod: dayjs().format(fmt),
    changefreq: 'weekly',
    priority: 0.8
  })

  // Per-version release pages
  const releases = releaseData.getAllReleases()
  if (releases.length) {
    for (const r of releases) {
      urls.push({
        loc: `${host}/releases/${r.version}/`,
        lastmod: dayjs(r.date).format(fmt),
        changefreq: 'yearly',
        priority: 0.4
      })
    }
    console.log(`✅ Added ${releases.length} release pages to sitemap`)
  }

  createSitemap({
    filePath: resolve(cwd, 'public/sitemap.xml'),
    urls
  })
}

buildSiteMap()
