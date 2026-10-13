import { Reveal } from '../ui'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { waLink } from '../../config'
import { EASE, FEATURE_POINTS, spot, SPOT_BG, Arrow, PillButton, Marquee } from './shared'

export default function FeatureBandSection() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-7%', reduce ? '-7%' : '7%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-charcoal">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-champagne/10 blur-[140px]" aria-hidden="true" />

      <div className="relative grid md:grid-cols-2">
        {/* image side */}
        <div className="relative min-h-[420px] overflow-hidden sm:min-h-[520px] md:min-h-[680px]">
          <motion.div style={{ y: imgY }} className="absolute -inset-y-[10%] inset-x-0">
            <motion.div
              initial={{ scale: 1.12 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE }}
              className="h-full w-full"
            >
              <img src="/features.png" alt="Hair and beauty transformation at Aora Luxe" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_30%]" />
            </motion.div>
          </motion.div>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-charcoal" />

          {/* floating glass card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-xs"
          >
            <div className="flex items-center gap-4 rounded-2xl border border-ivory/15 bg-obsidian/55 p-4 backdrop-blur-xl">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              <div>
                <p className="label text-[10px] tracking-[0.22em] text-ivory/80">Aora Luxe</p>
                <p className="font-serif text-lg leading-tight text-ivory">Hair · Beauty · Nails · Makeup</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* content side */}
        <div className="flex flex-col justify-center px-5 py-14 sm:px-10 md:px-12 md:py-20 lg:px-20">
          <Reveal>
            <div className="flex items-center gap-4">
              <p className="label text-[11px] tracking-[0.28em] text-champagne">The Aora Luxe touch</p>
              <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: EASE }} style={{ originX: 0 }} className="h-px w-12 bg-champagne/70" />
            </div>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
              Your next look <span className="italic text-champagne">starts here.</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ivory/80">
              Tell us how you want to look and feel. We will plan it around you, from a fresh cut to a full occasion look.
            </p>
          </Reveal>

          <ul className="mt-9 max-w-md space-y-3">
            {FEATURE_POINTS.map((f, i) => (
              <motion.li
                key={f.n}
                onMouseMove={spot}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-ivory/10 bg-obsidian/40 p-4 transition-colors duration-300 hover:border-champagne/40"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: SPOT_BG }} />
                <span className="relative font-serif text-2xl italic text-champagne">{f.n}</span>
                <div className="relative flex-1">
                  <p className="font-serif text-xl text-ivory">{f.t}</p>
                  <p className="text-sm text-ivory/75">{f.d}</p>
                </div>
                <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory/75 transition-all duration-300 group-hover:rotate-45 group-hover:border-champagne group-hover:bg-champagne group-hover:text-obsidian"><Arrow /></span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <PillButton href={waLink()}>Enquire on WhatsApp</PillButton>
            <PillButton to="/services" variant="ghost">Explore Services</PillButton>
          </div>
        </div>
      </div>

      {/* word strip */}
      <div className="relative border-t border-ivory/10 py-6">
        <Marquee words={['Hair', 'Beauty', 'Nails', 'Makeup']} className="font-serif text-4xl italic text-yellow-400 sm:text-5xl" />
      </div>
    </section>
  )
}
