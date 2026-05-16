import { useEffect } from 'react'

const SITE = 'https://figmamale.space'
const DEFAULT_TITLE = 'Satyam Dubey — UI/UX Designer'
const DEFAULT_DESC = 'Portfolio of Satyam Dubey, UI/UX Designer at Alphanso. Designing high-trust financial tools for advisors and their clients.'

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function usePageMeta({ title, description, image } = {}) {
  useEffect(() => {
    const t = title || DEFAULT_TITLE
    const d = description || DEFAULT_DESC
    const img = image ? (image.startsWith('http') ? image : SITE + image) : ''

    document.title = t
    setMeta('name', 'description', d)
    setMeta('property', 'og:title', t)
    setMeta('property', 'og:description', d)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', window.location.href)
    if (img) setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', t)
    setMeta('name', 'twitter:description', d)
    if (img) setMeta('name', 'twitter:image', img)

    return () => { document.title = DEFAULT_TITLE }
  }, [title, description, image])
}
