import { Reveal } from '../ui'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { waLink } from '../../config'
import { EASE, REVIEWS, AUTOPLAY, spot, SPOT_BG, Arrow, PillButton } from './shared'

const Star = ({ filled = true }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
)

function Stars({ n = 5 }) {
  return (
    <div className="flex gap-1 text-champagne" role="img" aria-label={`${n} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((s) => (
        <motion.span
          key={s}
          initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.25 + s * 0.07, ease: EASE }}
          className="inline-block"
        >
          <Star filled={s < n} />
        </motion.span>
      ))}
    </div>
  )
}

const reviewSlide = {
  enter: (d) => ({ opacity: 0, x: d * 70, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
  exit: (d) => ({ opacity: 0, x: d * -70, scale: 0.97, transition: { duration: 0.35, ease: 'easeIn' } }),
}

const initialsOf = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export default function ReviewsSection() {
  const reduce = useReducedMotion()
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const n = REVIEWS.length

  const next = () => { setDir(1); setIdx((i) => (i + 1) % n) }
  const prev = () => { setDir(-1); setIdx((i) => (i - 1 + n) % n) }
  const pick = (i) => { setDir(i > idx ? 1 : -1); setIdx(i) }

  /* autoplay: restarts on every change, pauses on hover / focus / touch */
  useEffect(() => {
    if (paused || reduce || n < 2) return
    const t = setTimeout(() => { setDir(1); setIdx((i) => (i + 1) % n) }, AUTOPLAY)
    return () => clearTimeout(t)
  }, [idx, paused, reduce, n])

  if (!n) return null
  const r = REVIEWS[idx]

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
  }

  return (
    <section className="relative overflow-hidden border-t border-ivory/10 bg-charcoal" aria-roledescription="carousel" aria-label="Guest reviews">
      {/* ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-champagne/10 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full blur-[140px]" style={{ background: 'rgba(244,114,148,0.09)' }} />

      <div className="relative mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        {/* header */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4">
                <p className="label text-[11px] tracking-[0.28em] text-champagne">Guest reviews</p>
                <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: EASE }} style={{ originX: 0 }} className="h-px w-12 bg-champagne/70" />
              </div>
              <h2 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">Loved by our <span className="italic text-champagne">guests.</span></h2>
            </div>
            <div className="flex flex-col items-start gap-4 sm:items-end">
              <p className="max-w-xs text-ivory/80 sm:text-right">Kind words from the people who sit in our chairs.</p>
              <PillButton href={waLink('Hello Aora Luxe, I would like to share my review.')} variant="ghost">Share your experience</PillButton>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:mt-14 lg:grid-cols-[1.7fr_1fr] lg:gap-8">
          {/* main card */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onKeyDown={onKey}
            className="flex flex-col"
          >
            <div className="relative flex-1 overflow-hidden rounded-[1.75rem] border border-ivory/10 bg-obsidian/60 backdrop-blur-sm transition-colors duration-500 hover:border-champagne/35">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.figure
                  key={idx}
                  custom={dir}
                  variants={reviewSlide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, { offset, velocity }) => {
                    if (offset.x < -70 || velocity.x < -400) next()
                    else if (offset.x > 70 || velocity.x > 400) prev()
                  }}
                  onMouseMove={spot}
                  style={{ touchAction: 'pan-y' }}
                  className="group relative flex h-full min-h-[340px] cursor-grab flex-col justify-between p-6 active:cursor-grabbing sm:min-h-[320px] sm:p-10 lg:p-12"
                  aria-live="polite"
                >
                  {/* spotlight */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: SPOT_BG }} />
                  {/* giant quote mark */}
                  <span aria-hidden="true" className="pointer-events-none absolute -top-2 right-5 select-none font-serif text-[9rem] leading-none text-champagne/15 sm:right-8 sm:text-[12rem]">"</span>

                  <div className="relative">
                    <Stars n={r.rating} />
                    <blockquote className="mt-6 font-serif text-xl leading-snug text-ivory sm:text-2xl lg:text-[1.9rem] lg:leading-[1.25]">
                      {r.text}
                    </blockquote>
                  </div>

                  <figcaption className="relative mt-8 flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-champagne to-ivory font-serif text-lg text-obsidian">{initialsOf(r.name)}</span>
                    <div className="min-w-0">
                      <p className="truncate font-serif text-lg text-ivory">{r.name}</p>
                      <p className="mt-0.5 inline-block rounded-full border border-champagne/40 px-3 py-0.5 text-[10px] uppercase tracking-[0.2em] text-champagne">{r.service}</p>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* controls */}
            <div className="mt-5 flex items-center gap-4">
              <button type="button" onClick={prev} aria-label="Previous review" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory transition-all duration-300 hover:-translate-x-0.5 hover:border-champagne hover:bg-champagne hover:text-obsidian focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne">
                <Arrow className="-rotate-[135deg]" />
              </button>
              <button type="button" onClick={next} aria-label="Next review" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/20 text-ivory transition-all duration-300 hover:translate-x-0.5 hover:border-champagne hover:bg-champagne hover:text-obsidian focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne">
                <Arrow className="rotate-45" />
              </button>

              <div className="relative h-px flex-1 overflow-hidden bg-ivory/15" aria-hidden="true">
                <motion.span
                  key={`${idx}-${paused}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused || reduce ? (reduce ? 1 : 0) : 1 }}
                  transition={{ duration: paused || reduce ? 0 : AUTOPLAY / 1000, ease: 'linear' }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-champagne"
                />
              </div>

              <p className="font-mono text-xs tracking-widest text-ivory/75">
                <span className="text-champagne">0{idx + 1}</span> / 0{n}
              </p>
            </div>
          </div>

          {/* reviewer selector: horizontal scroll on mobile, stacked on desktop */}
          <div
            role="tablist"
            aria-label="Choose a review"
            className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {REVIEWS.map((rv, i) => {
              const on = i === idx
              return (
                <motion.button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(i)}
                  whileHover={{ x: reduce ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex min-w-[230px] shrink-0 snap-start items-center gap-4 overflow-hidden rounded-2xl border border-ivory/10 p-4 text-left outline-none transition-colors duration-300 hover:border-champagne/40 focus-visible:border-champagne lg:min-w-0 lg:flex-1"
                >
                  {on && (
                    <motion.span
                      layoutId="review-active"
                      transition={{ duration: 0.5, ease: EASE }}
                      className="absolute inset-0 rounded-2xl border border-champagne bg-champagne/10"
                    />
                  )}
                  <span className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full font-serif transition-all duration-300 ${on ? 'bg-champagne text-obsidian' : 'bg-ivory/10 text-ivory group-hover:bg-ivory/20'}`}>{initialsOf(rv.name)}</span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate font-serif text-lg text-ivory">{rv.name}</span>
                    <span className={`block text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${on ? 'text-champagne' : 'text-ivory/70'}`}>{rv.service}</span>
                  </span>
                  <span className={`relative flex gap-0.5 text-champagne transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-40'}`} aria-hidden="true">
                    <span className="scale-75"><Star /></span>
                    <span className="font-mono text-xs leading-5">{rv.rating}</span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
