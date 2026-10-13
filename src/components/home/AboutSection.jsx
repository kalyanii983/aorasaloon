import { Reveal } from '../ui'
import { useState } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { EASE, PILLARS, STATS, StatCell, Arrow, PillButton } from './shared'

export default function AboutSection() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 70, damping: 18 })
  const sy = useSpring(my, { stiffness: 70, damping: 18 })
  const k = reduce ? 0 : 1
  const mainX = useTransform(sx, [-0.5, 0.5], [12 * k, -12 * k])
  const mainY = useTransform(sy, [-0.5, 0.5], [10 * k, -10 * k])
  const subX = useTransform(sx, [-0.5, 0.5], [-22 * k, 22 * k])
  const subY = useTransform(sy, [-0.5, 0.5], [-18 * k, 18 * k])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <section className="relative overflow-hidden bg-obsidian">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-champagne/10 blur-[140px]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1300px] items-center gap-14 px-5 py-20 sm:px-8 md:grid-cols-2 md:gap-12 lg:gap-24 lg:px-14 lg:py-32">
        <Reveal>
          <div onMouseMove={onMove} onMouseLeave={onLeave} className="relative mx-auto aspect-[4/4.3] w-full max-w-[520px]">
            <motion.div
              style={{ x: mainX, y: mainY }}
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: EASE }}
              className="group absolute left-0 top-0 h-[84%] w-[68%] overflow-hidden rounded-t-full border border-ivory/10"
            >
              <div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-110">
                <img src="/about-main.jpg" alt="Stylist working on a client's hair at Aora Luxe" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_30%]" />
              </div>
            </motion.div>

            <motion.div
              style={{ x: subX, y: subY }}
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, delay: 0.25, ease: EASE }}
              className="group absolute bottom-0 right-0 h-[65%] w-[52%] overflow-hidden rounded-t-full border-[6px] border-obsidian sm:border-8"
            >
              <div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-110">
                <img src="/allinone.png" alt="Hair, beauty, nails and makeup at Aora Luxe" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_25%]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
              className="absolute right-[30%] top-[52%] z-10 grid h-24 w-24 place-items-center rounded-full border border-champagne/40 bg-charcoal shadow-2xl shadow-black/50 sm:h-28 sm:w-28"
            >
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full text-yellow-400"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              >
                <defs><path id="about-badge-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>
                <text fill="currentColor" fontSize="8.5" letterSpacing="1.5" className="uppercase" style={{ fontFamily: 'inherit' }}>
                  <textPath href="#about-badge-path" textLength="228" lengthAdjust="spacing">Aora Luxe · Hair · Beauty · Nails · Makeup ·</textPath>
                </text>
              </motion.svg>
              <span className="font-serif text-3xl italic text-yellow-400">A</span>
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex items-center gap-4">
            <p className="label text-[11px] tracking-[0.28em] text-champagne">(01) About Aora Luxe</p>
            <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4, ease: EASE }} style={{ originX: 0 }} className="h-px w-12 bg-champagne/70" />
          </div>

          <h2 className="mt-5 font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
            Beauty is personal, <span className="italic text-champagne">never uniform.</span>
          </h2>

          <p className="mt-6 max-w-lg leading-relaxed text-ivory/85">
            Aora Luxe brings hair, beauty, nail art and makeup together in one welcoming unisex salon, so your style stays unmistakably yours.
          </p>

          <ul className="mt-9 max-w-xl" onMouseLeave={() => setActive(0)}>
            {PILLARS.map((p, i) => {
              const on = active === i
              return (
                <li
                  key={p.title}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  tabIndex={0}
                  className="relative cursor-pointer border-t border-ivory/10 py-5 outline-none last:border-b"
                >
                  <motion.span animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.6, ease: EASE }} style={{ originX: 0 }} className="absolute -top-px left-0 h-px w-full bg-champagne" />
                  <div className="flex items-start gap-5">
                    <span className={`mt-1.5 font-mono text-[11px] tracking-widest transition-colors duration-300 ${on ? 'text-champagne' : 'text-ivory/65'}`}>0{i + 1}</span>
                    <div className="flex-1">
                      <h3 className={`font-serif text-2xl transition-all duration-300 ${on ? 'translate-x-1 text-champagne' : 'text-ivory'}`}>{p.title}</h3>
                      <motion.div initial={false} animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
                        <p className="pt-2 text-sm leading-relaxed text-ivory/80">{p.text}</p>
                      </motion.div>
                    </div>
                    <span className={`mt-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${on ? 'rotate-45 border-champagne bg-champagne text-obsidian' : 'border-ivory/20 text-ivory/75'}`}><Arrow /></span>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 grid max-w-xl grid-cols-3 divide-x divide-ivory/10 overflow-hidden rounded-2xl border border-ivory/10 bg-charcoal/50 backdrop-blur-sm transition-colors duration-500 hover:border-champagne/30">
            {STATS.map((s, i) => <StatCell key={s.label} stat={s} i={i} />)}
          </div>

          <div className="mt-9"><PillButton to="/about">Our Story</PillButton></div>
        </Reveal>
      </div>
    </section>
  )
}
