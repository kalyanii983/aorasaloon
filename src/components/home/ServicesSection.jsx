import { Link } from 'react-router-dom'
import { Reveal, Photo } from '../ui'
import { SERVICES } from '../../config'
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion'
import { EASE, spot, SPOT_BG, Arrow, imageFor } from './shared'

/* ───────── SERVICE CARD (3D tilt, image zoom, spotlight, reveal text) ───────── */
function ServiceCard({ s, i }) {
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 160, damping: 18 })
  const sry = useSpring(ry, { stiffness: 160, damping: 18 })
  const src = imageFor(s)

  const onMove = (e) => {
    spot(e)
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
  }
  const onLeave = () => { rx.set(0); ry.set(0) }

  return (
    <Reveal delay={i * 0.08} className={i % 2 ? 'lg:mt-14' : ''}>
      <motion.div style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} onMouseMove={onMove} onMouseLeave={onLeave}>
        <Link
          to={`/services/${s.slug}`}
          className="group relative block aspect-[3/4] overflow-hidden rounded-[1.5rem] border border-ivory/10 bg-charcoal outline-none transition-colors duration-500 hover:border-champagne/50 focus-visible:border-champagne"
        >
          {/* image */}
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-110">
            {src
              ? <img src={src} alt={s.title} loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
              : <Photo name={s.img} alt={s.title} className="!h-full !w-full" />}
          </div>

          {/* shading + spotlight */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent transition-opacity duration-500 group-hover:from-obsidian/95" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100" style={{ background: SPOT_BG }} />

          {/* number + arrow */}
          <div className="absolute inset-x-4 top-4 flex items-start justify-between">
            <span className="rounded-full border border-ivory/20 bg-obsidian/40 px-3 py-1 font-mono text-[10px] tracking-widest text-ivory backdrop-blur-md">0{i + 1}</span>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory/25 bg-obsidian/40 text-ivory backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:border-champagne group-hover:bg-champagne group-hover:text-obsidian"><Arrow /></span>
          </div>

          {/* text */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <h3 className="font-serif text-3xl leading-none text-ivory transition-colors duration-300 group-hover:text-champagne">{s.title}</h3>
            <div className="grid grid-rows-[1fr] transition-all duration-500 ease-out lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-visible:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="pt-3 text-sm leading-relaxed text-ivory/85">{s.blurb}</p>
              </div>
            </div>
            <span className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-champagne">
              <span className="h-px w-8 bg-champagne transition-all duration-500 group-hover:w-14" />
              Explore
            </span>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  )
}

export default function ServicesSection() {
  return (
    <section className="border-t border-ivory/10 bg-obsidian py-20 lg:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
        <Reveal>
          <p className="label text-[11px] tracking-[0.28em] text-champagne">Signature services</p>
          <h2 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">Crafted around <span className="italic text-champagne">you.</span></h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-8 min-[480px]:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-y-12">
          {SERVICES.map((s, i) => <ServiceCard key={s.slug} s={s} i={i} />)}
        </div>
      </div>
    </section>
  )
}
