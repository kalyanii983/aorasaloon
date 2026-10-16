import { Link } from 'react-router-dom'
import { Reveal } from '../ui'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useSpring, useReducedMotion, animate } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

/* ───────── DATA CONSTANTS ───────── */
export const HEADLINE = ['Your Beauty.', 'Your Style.', 'Your Signature.']

export const WHY = [
  { t: 'Personalised style consultations', icon: 'sparkle' },
  { t: 'Hair, beauty, nails and makeup in one place', icon: 'layers' },
  { t: 'A welcoming unisex salon experience', icon: 'heart' },
  { t: 'Convenient Yelahanka location', icon: 'pin' },
  { t: 'Easy appointment enquiries on WhatsApp', icon: 'chat' },
]

export const PILLARS = [
  { title: 'Personal by design', text: 'Every visit starts with a conversation about how you want to look and feel.' },
  { title: 'Four disciplines, one place', text: 'Hair, beauty, nail art and makeup together under one roof.' },
  { title: 'Welcoming to everyone', text: 'A relaxed unisex salon where every guest is treated with the same care.' },
]

export const STATS = [
  { to: 4, label: 'Disciplines, one salon' },
  { to: 1, label: 'Welcoming unisex space' },
  { text: 'Yelahanka', label: 'Bengaluru, Karnataka' },
]

export const FEATURE_POINTS = [
  { n: '01', t: 'Consultation first', d: 'We listen before we begin.' },
  { n: '02', t: 'Four disciplines', d: 'Hair, beauty, nails and makeup.' },
  { n: '03', t: 'Unisex and welcoming', d: 'One relaxed space for everyone.' },
]

/* ───────── REVIEWS DATA ─────────
   TODO: replace every entry below with GENUINE guest reviews (with the guest's permission),
   e.g. from your Google Business profile, Instagram or WhatsApp feedback.
   The placeholder text below is NOT a real review. The section hides itself if this array is empty. */
export const REVIEWS = [
  { name: 'Priya Sharma', service: 'Hair', rating: 5, text: 'The stylist really took the time to understand my hair texture and suggested the perfect cut and colour. Absolutely loved the transformation!' },
  { name: 'Rohan Iyer', service: 'Hair & Grooming', rating: 5, text: 'Great haircut and beard grooming experience. Calm atmosphere, top-notch hygiene, and really skilled stylists in Yelahanka.' },
  { name: 'Ananya Reddy', service: 'Beauty', rating: 5, text: 'Had a rejuvenating facial and cleanup here. My skin felt so fresh and radiant afterwards. Truly a luxurious yet relaxing experience.' },
  { name: 'Sneha Patel', service: 'Nail Art', rating: 5, text: 'Got custom gel extensions and nail art done for a wedding. The precision and attention to detail were simply phenomenal!' },
]
export const AUTOPLAY = 6500

/* Service images in /public */
export const SERVICE_IMAGES = { hair: '/hair.png', nail: '/nail.png', nails: '/nail.png', beauty: '/beauty.png', skin: '/beauty.png', makeup: '/makeup.png' }
export const imageFor = (s) => {
  const keys = [s.img, s.slug, s.title].filter(Boolean).map((x) => String(x).toLowerCase())
  for (const k of keys) {
    for (const name of Object.keys(SERVICE_IMAGES)) if (k.includes(name)) return SERVICE_IMAGES[name]
  }
  return null
}

/* Writes cursor position into CSS vars for spotlight effects */
export const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}
export const SPOT_BG = 'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(212,185,120,0.16), transparent 70%)'

/* ───────── DESKTOP-ONLY SCROLL ANIMATION HELPERS ───────── */
const DESKTOP_QUERY = '(min-width: 1024px)'

export function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches)
  useEffect(() => {
    const m = window.matchMedia(DESKTOP_QUERY)
    const on = () => setDesktop(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return desktop
}

const SECTION_VARIANTS = {
  up: { hidden: { opacity: 0, y: 90 }, show: { opacity: 1, y: 0 } },
  scale: { hidden: { opacity: 0, y: 50, scale: 0.94 }, show: { opacity: 1, y: 0, scale: 1 } },
  clip: {
    hidden: { opacity: 0, clipPath: 'inset(7% 4% 7% 4% round 36px)' },
    show: { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' },
  },
}

/* Wraps a whole section. Animates on scroll ONLY when `on` (desktop); otherwise renders static. */
export function ScrollSection({ on, from = 'up', children }) {
  const v = SECTION_VARIANTS[from]
  return (
    <motion.div
      initial={on ? v.hidden : false}
      whileInView={on ? v.show : undefined}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* Thin page-progress bar (desktop only) */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, originX: 0 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-champagne via-ivory to-champagne"
    />
  )
}

/* Masked line reveal used by the hero headline */
export const Line = ({ children, i, accent }) => (
  <span className="block overflow-hidden pb-[0.12em]">
    <motion.span
      initial={{ y: '110%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: EASE }}
      className={`block ${accent ? 'italic text-champagne' : ''}`}
    >
      {children}
    </motion.span>
  </span>
)

export const Arrow = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" className={`h-3 w-3 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M3 9l6-6M4 3h5v5" />
  </svg>
)

export const ICONS = {
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />,
  layers: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
  heart: <path d="M12 20s-7-4.4-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.6-9 9-9 9z" />,
  pin: <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />,
  chat: <path d="M4 5h16v11H9l-5 4V5z" />,
}
export const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
)

/* Pill button with a shimmer sweep on hover */
export function PillButton({ href, to, children, variant = 'gold', external = true }) {
  const base = 'group relative inline-flex items-center gap-3 overflow-hidden rounded-full py-2 pl-6 pr-2 text-sm font-medium transition-colors'
  const styles = variant === 'gold'
    ? 'bg-gradient-to-r from-[#C29B48] via-[#E8C87A] to-[#C29B48] text-obsidian font-semibold hover:opacity-95 shadow-md shadow-lime/20'
    : 'border border-ivory/25 text-ivory hover:border-lime hover:text-lime'
  const knob = variant === 'gold' ? 'bg-obsidian text-lime' : 'bg-lime text-obsidian'
  const inner = (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 opacity-0 blur-sm transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100" />
      <span className="relative">{children}</span>
      <span className={`relative grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${knob}`}><Arrow /></span>
    </>
  )
  return (
    <motion.span className="inline-block" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
      {to
        ? <Link to={to} className={`${base} ${styles}`}>{inner}</Link>
        : <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className={`${base} ${styles}`}>{inner}</a>}
    </motion.span>
  )
}

/* Endless scrolling word strip */
export function Marquee({ words, className = '' }) {
  const reduce = useReducedMotion()
  const list = [...words, ...words, ...words]
  const row = (k) => (
    <div key={k} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={k > 0 ? 'true' : undefined}>
      {list.map((w, i) => (
        <span key={`${k}-${i}`} className="flex items-center gap-8">
          <span className={className || 'font-serif text-4xl italic text-yellow-400 sm:text-5xl'}>{w}</span>
          <span className="text-yellow-400">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="overflow-hidden">
      <motion.div className="flex w-max" animate={reduce ? undefined : { x: ['0%', '-50%'] }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}>
        {row(0)}{row(1)}
      </motion.div>
    </div>
  )
}

/* Counts from 0 to `to` when scrolled into view */
export function CountUp({ to }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [n, setN] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, reduce])

  return <span ref={ref}>{n}</span>
}

/* One stat cell: cursor spotlight, count-up, animated underline */
export function StatCell({ stat, i }) {
  return (
    <motion.div
      onMouseMove={spot}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE }}
      className="group relative min-w-0 cursor-default overflow-hidden p-3 sm:p-5"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: SPOT_BG }} />
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <p className={`relative break-words font-serif leading-none text-ivory transition-transform duration-300 group-hover:-translate-y-0.5 ${stat.text ? 'text-base min-[400px]:text-xl sm:text-2xl' : 'text-4xl sm:text-5xl'}`}>
        {stat.text ? stat.text : <CountUp to={stat.to} />}
      </p>
      <p className="label relative mt-3 text-[9px] leading-snug tracking-[0.16em] text-ivory/70 transition-colors duration-300 group-hover:text-champagne">{stat.label}</p>
    </motion.div>
  )
}
