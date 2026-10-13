import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SITE } from '../config'

export function useSeo(title, desc) {
  useEffect(() => {
    document.title = `${title} | Aora Luxe`
    const m = document.querySelector('meta[name=description]'); if (m) m.content = desc
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

export const Logo = () => (
  <span className="flex items-center gap-3">
    <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="none" stroke="#E6F078" strokeWidth="2"/><path d="M20 46 32 16l12 30M25 36h14" fill="none" stroke="#E6F078" strokeWidth="3"/></svg>
    <span className="font-serif text-xl tracking-[0.25em] text-lime">AORA LUXE</span>
  </span>
)
