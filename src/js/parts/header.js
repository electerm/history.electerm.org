// Header behavior: the mobile nav panel.
//
// The archive is English-only, so the language dropdown this module used to
// manage is gone — and with it the shared language setting (./lang.js) that the
// Blog nav links used to follow. What is left is the small-screen menu: the
// toggle button, plus closing the panel when a link is tapped, when the page is
// clicked outside it, or on Escape.

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
