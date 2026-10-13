import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Reveal } from './ui'

/* ---------- Content (edit freely) ---------- */

const EASE = [0.22, 1, 0.36, 1]

const PILLARS = [
    { c: '212,185,120', title: 'Listen first', text: 'Every visit starts with a conversation about your hair, skin, schedule and style, before any tool comes out.' },
    { c: '244,114,148', title: 'One roof, every look', text: 'Hair, beauty, nails and makeup are under one roof, so a full occasion look can be finished in a single visit.' },
    { c: '52,211,153', title: 'For everyone', text: 'A unisex salon where men, women and teens get the same attention to detail and the same welcome.' },
    { c: '167,139,250', title: 'Clean and comfortable', text: 'Fresh tools, a calm space and unhurried appointments, so you leave relaxed and happy with the result.' },
]

const SERVICES = [
    { id: 'hair', label: 'Hair', img: '/hair.png', title: 'Hair styling and colour', text: 'Precision cuts, blow-dries, colour, highlights and treatments tailored to your hair type and routine.', points: ['Cuts and styling', 'Colour and highlights', 'Smoothing and spa treatments'] },
    { id: 'beauty', label: 'Beauty', img: '/beauty.png', title: 'Beauty and skincare', text: 'Facials, cleanups and grooming rituals that leave your skin fresh, even and glowing.', points: ['Facials and cleanups', 'Waxing and threading', 'Skin-first consultations'] },
    { id: 'nails', label: 'Nails', img: '/nail.png', title: 'Nail art and care', text: 'From a clean, simple manicure to detailed custom nail art for weddings and parties.', points: ['Manicure and pedicure', 'Gel and extensions', 'Custom nail art'] },
    { id: 'makeup', label: 'Makeup', img: '/makeup.png', title: 'Makeup', text: 'Soft everyday looks to full occasion makeup, planned with you and finished to last.', points: ['Party and occasion makeup', 'Bridal and engagement', 'Trial sessions'] },
]

const STEPS = [
    { title: 'Consult', text: 'We talk through what you want, what suits you and what is realistic.' },
    { title: 'Create', text: 'Your stylist works at an easy pace and checks in at every stage.' },
    { title: 'Finish and style', text: 'We finish the look and show you how to recreate it at home.' },
]

const ADDRESS = 'No. 102, Thirumenahalli, Markandaiah Nagar, Yelahanka, Bengaluru – 560064'
const PHONE_DISPLAY = '+91 96861 35502'
const PHONE_LINK = 'tel:+919686135502'

/* ---------- Shared bits ---------- */

const Arrow = ({ className = '' }) => (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M3 9l6-6M4 3h5v5" />
    </svg>
)

const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}
const SPOT_BG = 'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(212,185,120,0.16), transparent 70%)'

function Eyebrow({ children }) {
    return (
        <div className="flex items-center gap-4">
            <p className="label font-mono text-[11px] tracking-[0.28em] text-champagne">{children}</p>
            <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: EASE }} style={{ originX: 0 }} className="h-px w-12 bg-champagne/70" />
        </div>
    )
}

/* Pill button with shimmer sweep */
function PillButton({ to, href, children, variant = 'gold', external = false }) {
    const base = 'group relative inline-flex items-center gap-3 overflow-hidden rounded-full py-2 pl-6 pr-2 text-sm font-medium transition-colors'
    const styles = variant === 'gold' ? 'bg-champagne text-obsidian hover:bg-ivory' : 'border border-ivory/25 text-ivory hover:border-champagne hover:text-champagne'
    const knob = variant === 'gold' ? 'bg-obsidian text-champagne' : 'bg-champagne text-obsidian'
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

/* Thin gold progress bar at the top of the page */
function ScrollBar() {
    const { scrollYProgress } = useScroll()
    const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
    return <motion.div aria-hidden="true" style={{ scaleX: sx, transformOrigin: '0% 50%' }} className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-champagne" />
}

/* Endless outlined word strip */
function Marquee({ words }) {
    const reduce = useReducedMotion()
    const list = [...words, ...words, ...words]
    const row = (k) => (
        <div key={k} className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={k > 0 ? 'true' : undefined}>
            {list.map((w, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-8">
                    <span className="font-serif text-5xl italic text-yellow-400 sm:text-7xl">{w}</span>
                    <span className="text-yellow-400">✦</span>
                </span>
            ))}
        </div>
    )
    return (
        <div className="overflow-hidden">
            <motion.div className="flex w-max" animate={reduce ? undefined : { x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
                {row(0)}{row(1)}
            </motion.div>
        </div>
    )
}

/* ---------- 1. Story (offset photo collage + pull quote) ---------- */

function Story() {
    const ref = useRef(null)
    const reduce = useReducedMotion()
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
    const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30])
    const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-20, 50])

    return (
        <section ref={ref} className="relative overflow-hidden bg-obsidian">
            <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full bg-champagne/10 blur-[140px]" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 pb-20 pt-4 sm:px-8 sm:pb-24 sm:pt-6 lg:grid-cols-12 lg:gap-12 lg:pb-32 lg:pt-8">
                {/* photo collage */}
                <div className="relative mx-auto w-full max-w-[560px] pb-14 pl-4 pt-4 lg:col-span-6">
                    <motion.div style={{ y: y1 }} className="relative w-[80%]">
                        <div aria-hidden="true" className="absolute -left-4 -top-4 h-full w-full rounded-[1.75rem] border border-champagne/40" />
                        <motion.div
                            initial={{ clipPath: 'inset(0 0 100% 0)' }}
                            whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.3, ease: EASE }}
                            className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem]"
                        >
                            <img src="/about-main.jpg" alt="Stylist working on a client's hair at Aora Luxe" loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_30%] transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                        </motion.div>
                    </motion.div>

                    <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 w-[52%]">
                        <motion.div
                            initial={{ clipPath: 'inset(100% 0 0 0)' }}
                            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.3, delay: 0.25, ease: EASE }}
                            className="group aspect-square overflow-hidden rounded-[1.5rem] border-[6px] border-obsidian shadow-2xl shadow-black/50"
                        >
                            <img src="/allinone.png" alt="Hair, beauty, nails and makeup at Aora Luxe" loading="lazy" decoding="async" className="h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                        className="absolute right-0 top-10 z-10 flex items-center gap-3 rounded-2xl border border-ivory/15 bg-obsidian/60 px-4 py-3 backdrop-blur-xl"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                        </span>
                        <div>
                            <p className="font-serif text-lg leading-none text-ivory">Aora Luxe</p>
                            <p className="label mt-1 text-[9px] tracking-[0.2em] text-ivory/80">Yelahanka, Bengaluru</p>
                        </div>
                    </motion.div>
                </div>

                {/* text */}
                <Reveal className="lg:col-span-6 lg:pl-6">
                    <Eyebrow>(01) Our story</Eyebrow>
                    <h2 className="mt-5 font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
                        Hair, beauty, nails, arts and makeup, <span className="italic text-champagne">together.</span>
                    </h2>
                    <p className="mt-6 max-w-xl leading-relaxed text-ivory/85">
                        Aora Luxe is a premium unisex salon in Yelahanka, Bengaluru. We believe a great look begins with listening, so we take time to understand what you want before we begin.
                    </p>

                    <blockquote className="mt-8 max-w-xl border-l-2 border-champagne pl-5">
                        <p className="font-serif text-2xl italic leading-snug text-ivory sm:text-3xl">Whether you are dropping in for a fresh cut or planning a special occasion, you are welcome here.</p>
                    </blockquote>

                    <div className="mt-9 flex flex-wrap gap-3">
                        <PillButton to="/services">View Services</PillButton>
                        <PillButton to="/gallery" variant="ghost">See Our Work</PillButton>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

/* ---------- 2. Pillars (expanding colour panels) ---------- */

function Pillars() {
    const [open, setOpen] = useState(0)

    return (
        <section className="relative overflow-hidden bg-charcoal py-20 lg:py-32">
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full blur-[140px]" style={{ background: 'rgba(167,139,250,0.10)' }} />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/4 h-[380px] w-[380px] rounded-full blur-[140px]" style={{ background: 'rgba(244,114,148,0.08)' }} />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <Reveal>
                    <Eyebrow>(02) What to expect</Eyebrow>
                    <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
                        <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
                            What you can expect <span className="italic text-champagne">when you visit.</span>
                        </h2>
                        <p className="max-w-xs text-ivory/80">A few simple things we hold to on every appointment.</p>
                    </div>
                </Reveal>

                <div className="mt-12 flex flex-col gap-3 lg:h-[440px] lg:flex-row" onMouseLeave={() => setOpen(0)}>
                    {PILLARS.map((p, i) => {
                        const on = open === i
                        return (
                            <motion.div
                                key={p.title}
                                onMouseEnter={() => setOpen(i)}
                                onFocus={() => setOpen(i)}
                                onClick={() => setOpen(i)}
                                tabIndex={0}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                                style={{
                                    '--c': p.c,
                                    background: 'linear-gradient(160deg, rgba(var(--c),0.22), rgba(var(--c),0.05) 60%, rgba(14,14,14,0.6))',
                                    borderColor: on ? 'rgba(var(--c),0.7)' : 'rgba(var(--c),0.25)',
                                }}
                                className={`group relative flex min-h-[96px] min-w-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border p-5 outline-none transition-all duration-700 ease-out sm:p-6 ${on ? 'lg:flex-[3.4]' : 'lg:flex-1'}`}
                            >
                                <span aria-hidden="true" className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition-all duration-700 ${on ? 'scale-150 opacity-100' : 'opacity-50'}`} style={{ background: 'rgba(var(--c),0.35)' }} />

                                <div className="relative flex items-start justify-between">
                                    <span className="font-serif text-5xl italic leading-none" style={{ color: 'rgb(var(--c))' }}>0{i + 1}</span>
                                    <span className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-500 ${on ? 'rotate-45 border-transparent text-obsidian' : 'text-ivory/70'}`} style={{ borderColor: on ? 'transparent' : 'rgba(var(--c),0.5)', background: on ? 'rgb(var(--c))' : 'transparent' }}>
                                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 1v10M1 6h10" /></svg>
                                    </span>
                                </div>

                                <div className="relative mt-8">
                                    <h3 className="font-serif text-2xl leading-tight text-ivory">{p.title}</h3>
                                    <div className={`grid transition-all duration-700 ease-out ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <p className="max-w-md pt-3 text-sm leading-relaxed text-ivory/85">{p.text}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

/* ---------- 3. Services (list + live image panel) ---------- */

function ServiceTabs() {
    const [active, setActive] = useState(0)
    const s = SERVICES[active]

    return (
        <section className="relative overflow-hidden bg-obsidian py-20 lg:py-32">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <Reveal>
                    <Eyebrow>(03) Services</Eyebrow>
                    <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
                        Everything <span className="italic text-champagne">under one roof.</span>
                    </h2>
                    <p className="mt-4 max-w-md text-ivory/80">Pick a category to see what we offer.</p>
                </Reveal>

                <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
                    {/* tab list */}
                    <div role="tablist" aria-label="Service categories" className="flex flex-col self-center">
                        {SERVICES.map((x, i) => {
                            const on = i === active
                            return (
                                <button
                                    key={x.id}
                                    type="button"
                                    role="tab"
                                    id={`tab-${x.id}`}
                                    aria-selected={on}
                                    aria-controls="service-panel"
                                    onClick={() => setActive(i)}
                                    onMouseEnter={() => setActive(i)}
                                    onFocus={() => setActive(i)}
                                    className="group relative flex items-center gap-5 border-t border-ivory/10 py-5 text-left outline-none last:border-b sm:py-6"
                                >
                                    {on && <motion.span layoutId="svc-line" className="absolute -top-px left-0 h-px w-full bg-champagne" transition={{ duration: 0.5, ease: EASE }} />}
                                    <span className={`font-mono text-[11px] tracking-widest transition-colors duration-300 ${on ? 'text-champagne' : 'text-ivory/65'}`}>0{i + 1}</span>
                                    <span className="flex-1">
                                        <span className={`block font-serif text-4xl leading-none transition-all duration-500 sm:text-5xl ${on ? 'translate-x-2 text-champagne' : 'text-ivory/80'}`}>{x.label}</span>
                                        <span className={`mt-2 block text-sm transition-all duration-500 ${on ? 'translate-x-2 text-ivory/80' : 'text-ivory/0'}`}>{x.title}</span>
                                    </span>
                                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 ${on ? 'rotate-45 border-champagne bg-champagne text-obsidian' : 'border-ivory/20 text-ivory/60'}`}><Arrow /></span>
                                </button>
                            )
                        })}
                    </div>

                    {/* image panel */}
                    <div id="service-panel" role="tabpanel" aria-labelledby={`tab-${s.id}`} className="relative min-h-[460px] overflow-hidden rounded-[1.75rem] border border-ivory/10 bg-charcoal sm:min-h-[540px]">
                        {SERVICES.map((x, i) => (
                            <img
                                key={x.id}
                                src={x.img}
                                alt={x.title}
                                loading="lazy"
                                decoding="async"
                                className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-[900ms] ease-out ${i === active ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
                            />
                        ))}
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />

                        <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                            <h3 className="font-serif text-3xl leading-tight text-ivory sm:text-4xl">{s.title}</h3>
                            <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/85">{s.text}</p>
                            <ul className="mt-5 flex flex-wrap gap-2">
                                {s.points.map((pt) => (
                                    <li key={pt} className="rounded-full border border-ivory/20 bg-obsidian/50 px-3 py-1.5 text-xs text-ivory/90 backdrop-blur-md">{pt}</li>
                                ))}
                            </ul>
                            <div className="mt-6"><PillButton to="/services">Explore {s.label}</PillButton></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ---------- 4. Process (timeline that draws in) ---------- */

function Process() {
    return (
        <section className="relative overflow-hidden bg-charcoal py-20 lg:py-32">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[620px] -translate-x-1/2 rounded-full bg-champagne/10 blur-[150px]" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <Reveal>
                    <Eyebrow>(04) The process</Eyebrow>
                    <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
                        How your appointment <span className="italic text-champagne">works.</span>
                    </h2>
                </Reveal>

                <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
                    <motion.span
                        aria-hidden="true"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.6, ease: EASE }}
                        style={{ originX: 0 }}
                        className="absolute left-7 right-7 top-7 hidden h-px bg-gradient-to-r from-champagne via-champagne/50 to-champagne/10 md:block"
                    />
                    {STEPS.map((s, i) => (
                        <motion.li
                            key={s.title}
                            onMouseMove={spot}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: EASE }}
                            className="group relative"
                        >
                            <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-champagne/60 bg-obsidian font-serif text-2xl italic text-champagne transition-all duration-500 group-hover:scale-110 group-hover:bg-champagne group-hover:text-obsidian">{i + 1}</span>
                            <div className="relative mt-6 overflow-hidden rounded-2xl border border-ivory/10 bg-obsidian/50 p-6 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-champagne/40">
                                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: SPOT_BG }} />
                                <h3 className="relative font-serif text-2xl text-ivory transition-colors duration-300 group-hover:text-champagne">{s.title}</h3>
                                <p className="relative mt-3 text-sm leading-relaxed text-ivory/80">{s.text}</p>
                                <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-700 ease-out group-hover:scale-x-100" />
                            </div>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </section>
    )
}

/* ---------- 5. Visit + CTA ---------- */

function VisitCTA() {
    const reduce = useReducedMotion()
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Aora Luxe ' + ADDRESS)}`

    const actions = [
        { label: 'Book an Appointment', sub: 'Plan your visit', to: '/contact', primary: true },
        { label: `Call ${PHONE_DISPLAY}`, sub: 'Talk to the salon', href: PHONE_LINK },
        { label: 'Get Directions', sub: 'Open in Google Maps', href: mapsUrl, external: true },
    ]

    return (
        <section className="relative overflow-hidden bg-obsidian px-5 py-20 sm:px-8 lg:py-32">
            <Reveal>
                <div onMouseMove={spot} className="group relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-champagne/25 bg-gradient-to-br from-charcoal via-obsidian to-charcoal p-8 sm:p-12 lg:p-16">
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: SPOT_BG }} />
                    <motion.div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full border border-dashed border-champagne/20" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} />
                    <motion.div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full border border-ivory/10" animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />

                    <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
                        <div>
                            <Eyebrow>(05) Visit us</Eyebrow>
                            <h2 className="mt-5 font-serif text-5xl leading-[1] text-ivory sm:text-6xl lg:text-7xl">
                                Come in and <span className="italic text-champagne">say hello.</span>
                            </h2>
                            <address className="mt-6 max-w-md not-italic leading-relaxed text-ivory/80">
                                {ADDRESS}
                                <br />Opposite Antalea Homes / Villas
                            </address>
                        </div>

                        <div className="space-y-3">
                            {actions.map((a, i) => {
                                const cls = `group/row relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 sm:p-5 ${a.primary ? 'border-champagne bg-champagne text-obsidian hover:bg-ivory' : 'border-ivory/15 bg-obsidian/40 text-ivory hover:border-champagne/60'}`
                                const body = (
                                    <>
                                        <span>
                                            <span className="block font-serif text-xl leading-tight sm:text-2xl">{a.label}</span>
                                            <span className={`label mt-1 block text-[10px] tracking-[0.2em] ${a.primary ? 'text-obsidian/60' : 'text-ivory/70'}`}>{a.sub}</span>
                                        </span>
                                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover/row:rotate-45 ${a.primary ? 'bg-obsidian text-champagne' : 'border border-ivory/25 text-ivory group-hover/row:border-champagne group-hover/row:bg-champagne group-hover/row:text-obsidian'}`}><Arrow /></span>
                                    </>
                                )
                                return (
                                    <motion.div key={a.label} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE }}>
                                        {a.to
                                            ? <Link to={a.to} className={cls}>{body}</Link>
                                            : <a href={a.href} {...(a.external ? { target: '_blank', rel: 'noreferrer' } : {})} className={cls}>{body}</a>}
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    )
}

/* ---------- Main export ---------- */

export default function AboutContent() {
    return (
        <div className="bg-obsidian text-ivory">
            <ScrollBar />
            <Story />
            <div className="border-y border-ivory/10 bg-obsidian py-6"><Marquee words={['Listen', 'Create', 'Style', 'Glow']} /></div>
            <Pillars />
            <ServiceTabs />
            <Process />
            <VisitCTA />
        </div>
    )
}