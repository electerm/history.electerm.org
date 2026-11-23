function getPanel () {
  return document.querySelector('.mobile-nav')
}

function getButton () {
  return document.querySelector('.mobile-menu-btn')
}

function setOpen (open) {
  const panel = getPanel()
  if (!panel) return
  panel.classList.toggle('open', open)
  const button = getButton()
  if (button) {
    button.setAttribute('aria-expanded', open ? 'true' : 'false')
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  }
}

function init () {
  const toggle = document.querySelector('[data-theme-toggle]')
  const root = document.documentElement
  toggle.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'))
  toggle.addEventListener('click', function () {
    const dark = root.dataset.theme !== 'dark'
    root.dataset.theme = dark ? 'dark' : 'light'
    toggle.setAttribute('aria-pressed', String(dark))
    document.querySelector('meta[name="theme-color"]').content = dark ? '#0f172a' : '#ffffff'
    try {
      window.localStorage.setItem('theme', root.dataset.theme)
    } catch {}
  })

  const button = getButton()
  const panel = getPanel()
  if (!button || !panel) return

  button.addEventListener('click', function (e) {
    e.stopPropagation()
    setOpen(!panel.classList.contains('open'))
  })

  // Tapping a link navigates away — close the panel so going back shows the
  // page rather than the menu again.
  panel.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false)
  })

  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && !button.contains(e.target)) setOpen(false)
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false)
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
