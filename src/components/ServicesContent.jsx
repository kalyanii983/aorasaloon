import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MotionConfig, motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { SERVICES, waLink } from '../config'
import { Photo, Reveal } from './ui'

const EASE = [0.22, 1, 0.36, 1]
const VIEWPORT = { once: true, margin: '-80px' }

/* Height (px) of your fixed site header (top banner 32px + nav 68px). The sticky service nav sits right below it. */
const STICKY_TOP = 100

/* ---------- Images (files live in /public) ----------
      Drop a service image at  /public/services/<slug>.jpg
      or use the fallbacks below. If no file exists you get a
      gradient placeholder with the service name. */
const MEDIA = {
    hair:       { main: '/hair.png' },
    'mens-grooming': { main: '/services/mens-grooming.jpg' },
    groomingmen: { main: '/services/mens-grooming.jpg' },
    'skin-care': { main: '/beauty.png' },
    'nail-services': { main: '/nail.png' },
    'makeup-bridal': { main: '/makeup.png' },
    'waxing-threading': { main: '/services/waxing-threading.jpg' },
    threading: { main: '/services/waxing-threading.jpg' },
    'massage-relaxation': { main: '/services/massage-relaxation.jpg' },
}

function mediaFor(s) {
    if (MEDIA[s.slug]) return MEDIA[s.slug]
    const key = `${s.img || ''} ${s.slug || ''} ${s.title || ''}`.toLowerCase()
    if (key.includes('hair')) return MEDIA.hair
    if (key.includes('massage') || key.includes('relaxation')) return MEDIA['massage-relaxation']
    if (key.includes('beauty') || key.includes('skin')) return MEDIA['skin-care']
    if (key.includes('nail')) return MEDIA['nail-services']
    if (key.includes('makeup') || key.includes('bridal')) return MEDIA['makeup-bridal']
    if (key.includes('mens') || key.includes('grooming')) return MEDIA['mens-grooming']
    if (key.includes('wax') || key.includes('thread')) return MEDIA['waxing-threading']
    return null
}

/* ---------- Desktop-only animation switch ---------- */
const AnimCtx = createContext(false)
const useAnimate = () => useContext(AnimCtx)

function useIsDesktop() {
    const [desktop, setDesktop] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        const update = () => setDesktop(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])
    return desktop
}

/* ---------- Animation variants ---------- */
const group = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

/* Real <img> with fallback */
function Pic({ src, fallback, alt, position = 'center' }) {
    const [url, setUrl] = useState(src)
    useEffect(() => setUrl(src), [src])
    return (
        <img
            src={url}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => fallback && url !== fallback && setUrl(fallback)}
            className="h-full w-full object-cover"
            style={{ objectPosition: position }}
        />
    )
}

function Media({ name, src, fallback, alt, position }) {
    return (
        <div className="h-full w-full transition-transform duration-700 ease-out lg:group-hover:scale-105">
            {src ? (
                <Pic src={src} fallback={fallback} alt={alt} position={position} />
            ) : (
                <Photo name={name} alt={alt} className="h-full w-full" />
            )}
        </div>
    )
}

/* ---------- Image placeholder banner ----------
   Shows when no real image exists. Gives the client a clear
   "drop your image here" zone. */
function ImagePlaceholder({ s, className = '' }) {
    return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-champagne/30 bg-gradient-to-br from-charcoal via-obsidian to-charcoal ${className}`}>
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_12px,rgba(212,185,120,0.15)_12px,rgba(212,185,120,0.15)_14px)]" />
            <div className="relative z-10 flex flex-col items-center gap-3 px-6 py-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-champagne/30 bg-champagne/10 text-champagne text-2xl">📷</span>
                <p className="font-serif text-lg text-champagne">{s.title}</p>
                <p className="text-xs text-ivory/50">Add your service image here</p>
            </div>
        </div>
    )
}

/* Mobile / tablet: plain frame */
function StaticFrame({ className = '', zoom, ...media }) {
    return (
        <div className={`group relative overflow-hidden bg-obsidian ${className}`}>
            <div className="h-full w-full" style={zoom ? { transform: `scale(${zoom})` } : undefined}>
                <Media {...media} />
            </div>
        </div>
    )
}

/* Desktop: wipe reveal on scroll + parallax */
function AnimatedFrame({ className = '', from = 'left', delay = 0, zoom = 1.18, ...media }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
    const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
    const hidden =
        from === 'right' ? 'inset(0 0 0 100%)' : from === 'bottom' ? 'inset(100% 0 0 0)' : 'inset(0 100% 0 0)'

    return (
        <motion.div
            ref={ref}
            initial={{ clipPath: hidden }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            viewport={VIEWPORT}
            transition={{ duration: 1.1, delay, ease: EASE }}
            className={`group relative overflow-hidden bg-obsidian ${className}`}
        >
            <motion.div style={{ y, scale: zoom }} className="h-full w-full">
                <Media {...media} />
            </motion.div>
        </motion.div>
    )
}

function MediaFrame(props) {
    const animate = useAnimate()
    return animate ? <AnimatedFrame {...props} /> : <StaticFrame {...props} />
}

/* Resolves to image frame or placeholder */
function Visual({ s, from, single }) {
    const media = mediaFor(s)
    const [ok, setOk] = useState(true)

    if (!media?.main) return <ImagePlaceholder s={s} className={single} />

    return (
        <div className="relative">
            <MediaFrame
                name={s.img}
                src={media?.main}
                alt={s.title}
                from={from}
                className={single}
                fallback={null}
            />
            {/* Invisible checker – if the image fails, swap to placeholder */}
            <img
                src={media.main}
                alt=""
                className="hidden"
                onError={() => setOk(false)}
            />
            {!ok && <ImagePlaceholder s={s} className={`absolute inset-0 ${single}`} />}
        </div>
    )
}

/* ---------- Service point chips ---------- */
function PointChip({ children, dark = true }) {
    const cls = dark
        ? 'border-ivory/20 text-ivory/90 hover:border-champagne hover:text-champagne hover:bg-champagne/10'
        : 'border-obsidian/15 text-obsidian/85 hover:border-obsidian hover:bg-obsidian hover:text-ivory'
    return (
        <li className={`border rounded-full px-3.5 py-1.5 text-[11px] tracking-wide transition-all duration-300 active:scale-95 sm:text-xs ${cls}`}>
            {children}
        </li>
    )
}

/* Service copy block */
function Copy({ s, index = 0, dark = true, split = false, className = '' }) {
    const heading = dark ? 'text-ivory' : 'text-obsidian'
    const body = dark ? 'text-ivory/85' : 'text-obsidian/80'
    const eyebrow = dark ? 'text-champagne' : 'text-obsidian/75'

    /* Show up to 6 points as chips + remaining as a collapsed "more" */
    const visiblePoints = (s.points || []).slice(0, 6)
    const extraPoints = (s.points || []).slice(6)
    const [showAll, setShowAll] = useState(false)

    const head = (
        <div>
            <p className={`mb-2.5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] ${eyebrow}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden className="h-px w-8 bg-current opacity-60" />
                <span>Service</span>
            </p>
            <h2 className={`font-serif text-2xl leading-[1.12] sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl ${heading}`}>
                {s.title}
            </h2>
        </div>
    )

    const rest = (
        <>
            <p className={`mt-3.5 max-w-md text-sm leading-relaxed sm:text-[15px] lg:text-base ${body} ${split ? 'md:mt-5' : 'lg:mt-4'}`}>
                {s.blurb}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
                {visiblePoints.map((p) => (
                    <PointChip key={p} dark={dark}>{p}</PointChip>
                ))}
                {showAll && extraPoints.map((p) => (
                    <PointChip key={p} dark={dark}>{p}</PointChip>
                ))}
            </ul>
            {extraPoints.length > 0 && (
                <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className={`mt-3 text-xs font-medium tracking-wide transition-colors ${dark ? 'text-champagne hover:text-lime' : 'text-obsidian/60 hover:text-obsidian'}`}
                >
                    {showAll ? '− Show less' : `+ ${extraPoints.length} more services`}
                </button>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
                <Link
                    to={`/services/${s.slug}`}
                    className="btn btn-gold w-full justify-center sm:w-auto"
                >
                    Explore {s.title}
                </Link>
                <a
                    href={waLink(`Hello Aora Luxe, I would like to enquire about ${s.title}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                        dark
                            ? 'border-ivory/25 text-ivory hover:border-champagne hover:text-champagne'
                            : 'border-obsidian/25 text-obsidian hover:border-obsidian hover:bg-obsidian hover:text-ivory'
                    }`}
                >
                    <MessageCircle size={14} /> WhatsApp Enquire
                </a>
            </div>
        </>
    )

    return (
        <div className={`${split ? 'md:grid md:grid-cols-2 md:items-start md:gap-8 lg:gap-14' : ''} ${className}`}>
            {head}
            {split ? <div>{rest}</div> : rest}
        </div>
    )
}

/* ---------- Layouts ---------- */

/* 1. Hair Services, Makeup & Bridal (bg-ivory sections) */
function OverlapLayout({ s, index }) {
    return (
        <div className="grid items-center gap-6 md:grid-cols-12 md:gap-8 lg:gap-12 xl:gap-16">
            <div className="relative md:col-span-6 lg:col-span-7">
                <Visual s={s} from="left" single="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/11] rounded-2xl md:rounded-3xl shadow-xl lg:shadow-2xl" />
            </div>
            <Copy
                s={s}
                index={index}
                dark
                className="mt-2 md:mt-0 rounded-2xl md:rounded-3xl bg-obsidian p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl border border-champagne/25 md:col-span-6 lg:col-span-5"
            />
        </div>
    )
}

/* 2. Men's Grooming, Waxing & Threading (bg-obsidian sections) */
function PortraitLayout({ s, index }) {
    return (
        <div className="grid items-center gap-6 md:grid-cols-12 md:gap-8 lg:gap-12 xl:gap-16">
            <Copy
                s={s}
                index={index}
                dark
                className="order-2 md:order-1 mt-2 md:mt-0 rounded-2xl md:rounded-3xl bg-charcoal/70 p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl border border-ivory/10 md:col-span-6 lg:col-span-5"
            />
            <div className="relative order-1 md:order-2 md:col-span-6 lg:col-span-7">
                <div aria-hidden className="absolute inset-0 hidden translate-x-3 translate-y-3 md:block rounded-3xl border border-champagne/30 pointer-events-none" />
                <div className="relative z-10">
                    <Visual s={s} from="right" single="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/11] rounded-2xl md:rounded-3xl shadow-xl lg:shadow-2xl" />
                </div>
            </div>
        </div>
    )
}

/* 3. Skin Care, Massage (bg-ivory sections) */
function WideLayout({ s, index }) {
    return (
        <div className="grid items-center gap-6 md:grid-cols-12 md:gap-8 lg:gap-12 xl:gap-16">
            <div className="relative md:col-span-6 lg:col-span-7">
                <Visual s={s} from="left" single="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/11] rounded-2xl md:rounded-3xl shadow-xl lg:shadow-2xl" />
            </div>
            <Copy
                s={s}
                index={index}
                dark
                className="mt-2 md:mt-0 rounded-2xl md:rounded-3xl bg-obsidian p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl border border-champagne/25 md:col-span-6 lg:col-span-5"
            />
        </div>
    )
}

/* 4. Nail Services (bg-obsidian sections) */
function DuoLayout({ s, index }) {
    return (
        <div className="grid items-center gap-6 md:grid-cols-12 md:gap-8 lg:gap-12 xl:gap-16">
            <div className="order-2 md:order-1 md:col-span-6 lg:col-span-5 mt-2 md:mt-0">
                <Copy
                    s={s}
                    index={index}
                    dark
                    className="rounded-2xl md:rounded-3xl bg-charcoal/70 p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl border border-ivory/10"
                />
            </div>
            <div className="relative order-1 md:order-2 md:col-span-6 lg:col-span-7">
                <div aria-hidden className="absolute inset-0 hidden -translate-x-3 translate-y-3 md:block rounded-3xl border border-champagne/30 pointer-events-none" />
                <div className="relative z-10">
                    <Visual s={s} from="right" single="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/11] rounded-2xl md:rounded-3xl shadow-xl lg:shadow-2xl" />
                </div>
            </div>
        </div>
    )
}

const LAYOUTS = [OverlapLayout, PortraitLayout, WideLayout, DuoLayout]

/* ---------- Page sections ---------- */

function Intro() {
    const [active, setActive] = useState(SERVICES[0]?.slug)
    const barRef = useRef(null)

    useEffect(() => {
        const els = SERVICES.map((s) => document.getElementById(s.slug)).filter(Boolean)
        if (!els.length) return
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: '-45% 0px -50% 0px' }
        )
        els.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [])

    useEffect(() => {
        const bar = barRef.current
        const chip = bar?.querySelector(`[data-slug="${active}"]`)
        if (bar && chip) {
            bar.scrollTo({
                left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2,
                behavior: 'smooth',
            })
        }
    }, [active])

    const jump = (e, slug) => {
        e.preventDefault()
        setActive(slug)
        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <>
            <section className="bg-ivory px-5 pb-6 pt-10 sm:pb-8 sm:pt-14">
                <div className="mx-auto max-w-7xl">
                    <p className="max-w-3xl font-serif text-xl leading-snug text-obsidian sm:text-2xl lg:text-3xl">
                        Choose one service or combine them for a complete look in a single visit. Everything here is for men and women.
                    </p>
                </div>
            </section>

            <div
                className="sticky top-[86px] sm:top-[92px] md:top-[98px] z-30 border-y border-obsidian/10 bg-ivory/90 backdrop-blur"
            >
                <nav
                    ref={barRef}
                    aria-label="Jump to a service"
                    className="relative mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {SERVICES.map((s) => {
                        const on = active === s.slug
                        return (
                            <a
                                key={s.slug}
                                data-slug={s.slug}
                                href={`#${s.slug}`}
                                onClick={(e) => jump(e, s.slug)}
                                aria-current={on ? 'true' : undefined}
                                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-colors duration-300 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian ${on
                                    ? 'border-obsidian bg-obsidian text-champagne'
                                    : 'border-obsidian/25 text-obsidian hover:bg-obsidian hover:text-champagne'
                                    }`}
                            >
                                {s.title}
                            </a>
                        )
                    })}
                </nav>
            </div>
        </>
    )
}

function ServiceBlock({ s, index }) {
    const Layout = LAYOUTS[index % LAYOUTS.length]
    const dark = index % 2 === 1
    return (
        <section
            id={s.slug}
            className={`relative scroll-mt-32 overflow-hidden py-10 sm:py-14 lg:py-24 ${dark ? 'bg-obsidian' : 'bg-ivory'}`}
        >
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                <Layout s={s} index={index} />
            </div>
        </section>
    )
}

function ClosingCTA() {
    const animate = useAnimate()
    const Wrapper = animate ? Reveal : 'div'
    return (
        <section className="bg-ivory px-5 py-14 sm:py-20 lg:py-28">
            <Wrapper className="mx-auto max-w-3xl text-center">
                <h2 className="font-serif text-3xl text-obsidian sm:text-4xl lg:text-5xl">
                    Not sure which service is right for you?
                </h2>
                <p className="mx-auto mt-4 max-w-xl leading-relaxed text-obsidian/85">
                    Tell us the occasion or the look you have in mind and we will suggest where to start.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                        className="btn btn-gold justify-center"
                        href={waLink('Hello Aora Luxe, I would like help choosing a service.')}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ask on WhatsApp
                    </a>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center rounded-full border border-obsidian/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory active:scale-95"
                    >
                        Book an Appointment
                    </Link>
                </div>
            </Wrapper>
        </section>
    )
}

/* ---------- Main export ---------- */

export default function ServicesContent() {
    const desktop = useIsDesktop()
    const reduce = useReducedMotion()
    const animate = desktop && !reduce

    return (
        <AnimCtx.Provider value={animate}>
            <MotionConfig reducedMotion="user">
                <Intro />
                {SERVICES.map((s, i) => (
                    <ServiceBlock key={s.slug} s={s} index={i} />
                ))}
                <ClosingCTA />
            </MotionConfig>
        </AnimCtx.Provider>
    )
}