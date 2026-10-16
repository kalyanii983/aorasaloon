import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SITE } from '../config'

export function useSeo(title, desc) {
  useEffect(() => {
    const fullTitle = `${title} | Aora Luxe`
    document.title = fullTitle

    const setMeta = (selector, attr, val) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        if (selector.startsWith('meta[name=')) {
          el.setAttribute('name', selector.match(/name="?([^"\]]+)"?/)[1])
        } else if (selector.startsWith('meta[property=')) {
          el.setAttribute('property', selector.match(/property="?([^"\]]+)"?/)[1])
        }
        document.head.appendChild(el)
      }
      el.setAttribute(attr, val)
    }

    if (desc) {
      setMeta('meta[name="description"]', 'content', desc)
      setMeta('meta[property="og:description"]', 'content', desc)
      setMeta('meta[name="twitter:description"]', 'content', desc)
    }
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)

    let c = document.querySelector('link[rel=canonical]')
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = SITE.domain + window.location.pathname
    window.scrollTo(0, 0)
  }, [title, desc])
}

export const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
)

const ASSET_MAP = {
  hair: '/hair.png',
  nails: '/nail.png',
  nail: '/nail.png',
  beauty: '/beauty.png',
  makeup: '/makeup.png',
  interior: '/about-main.jpg',
  feature: '/features.png',
  features: '/features.png',
  allinone: '/allinone.png',
  consulting: '/consulting.png',
  heroimg: '/heroimg.png',
}

// Gradient placeholder; shows src or resolved asset automatically once added.
export function Photo({ name, src, alt, className = '', priority = false }) {
  const [ok, setOk] = useState(true)
  const norm = name ? String(name).toLowerCase() : ''
  const imageSrc = src || (norm && ASSET_MAP[norm]) || (name ? `/images/${name}.jpg` : '')
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-charcoal via-[#2a2c24] to-champagne/40 ${className}`}>
      {ok && imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      )}
      {(!ok || !imageSrc) && <span className="absolute inset-0 grid place-items-center label text-champagne/60">{name || 'Image'}</span>}
    </div>
  )
}

export const Logo = ({ size = 'normal' }) => {
  const isLarge = size === 'large'
  return (
    <span className="flex items-center gap-3.5">
      <img
        src="/logo1.jpeg"
        alt="Aora Luxe Logo"
        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover ring-2 ring-lime/40 shadow-md transition-transform duration-300 hover:scale-105"
      />
      <span className="font-serif text-2xl sm:text-[1.7rem] tracking-[0.22em] text-lime font-medium">AORA LUXE</span>
    </span>
  )
}
