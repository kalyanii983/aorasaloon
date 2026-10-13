import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MotionConfig, motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SERVICES, waLink } from '../config'
import { Photo, Reveal } from './ui'

const EASE = [0.22, 1, 0.36, 1]
const VIEWPORT = { once: true, margin: '-80px' }

/* Height (px) of your fixed site header. The sticky service nav sits right below it. */
const STICKY_TOP = 64

/* ---------- Images (files live in /public) ----------
      - `main`  : the single image used for services that have one card.
      - `pair`  : services that get TWO cards (women + men).
      If a pair file does not exist yet, that card falls back to `main`. */
const MEDIA = {
    hair: {
        main: '/hair.png',
        pair: [
            { label: 'For women', src: '/hair.png' },
            { label: 'For men', src: 'https://i.pinimg.com/736x/1a/4f/26/1a4f2642ee1d58a7dd7583e6c9ad1a86.jpg' },
        ],
    },
    beauty: {
        main: '/beauty.png',
        pair: [
            { label: 'For women', src: '/beauty.png' },
            { label: 'For men', src: 'https://i.pinimg.com/1200x/d5/42/e3/d542e36a5630e84bcc7f0214474247e3.jpg' },
        ],
    },
    nail: { main: '/nail.png' },
    makeup: { main: '/makeup.png' },
}

function mediaFor(s) {
    const key = `${s.img || ''} ${s.slug || ''} ${s.title || ''}`.toLowerCase()
    if (key.includes('hair')) return MEDIA.hair
    if (key.includes('beauty') || key.includes('skin')) return MEDIA.beauty
    if (key.includes('nail')) return MEDIA.nail
    if (key.includes('makeup') || key.includes('make-up')) return MEDIA.makeup
    return null
}

const ACCENT_PHOTOS = ['interior', 'feature', 'beauty', 'hair']

/* ---------- Desktop-only animation switch ----------
   Animations run only on screens >= 1024px and when the user has not asked
   for reduced motion. Everything else renders static. */
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

/* ---------- Animation variants (used on desktop only) ---------- */
const group = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

/* Real <img> that falls back to another file if its own file is missing */
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

/* The actual picture (real image or placeholder) with a gentle hover zoom on desktop */
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

/* Mobile / tablet: plain frame, no motion at all */
function StaticFrame({ className = '', zoom, ...media }) {
    return (
        <div className={`group relative overflow-hidden bg-obsidian ${className}`}>
            <div className="h-full w-full" style={zoom ? { transform: `scale(${zoom})` } : undefined}>
                <Media {...media} />
            </div>
        </div>
    )
}

/* Desktop: wipe reveal on scroll + slight parallax drift */
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

/* Two image cards (women + men). Staggered and interactive on desktop only. */
function PairFrame({ s, pair, main, aspect }) {
    const animate = useAnimate()
    const [hover, setHover] = useState(null)

    return (
        <div
            className="grid grid-cols-2 items-start gap-3 sm:gap-5"
            onMouseLeave={() => setHover(null)}
        >
            {pair.map((card, i) => {
                const dimmed = animate && hover !== null && hover !== i
                const labelMotion = animate
                    ? {
                        initial: { opacity: 0, y: 10 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: VIEWPORT,
                        transition: { duration: 0.6, delay: 0.7 + i * 0.18, ease: EASE },
                    }
                    : {}
                return (
                    <div
                        key={card.label}
                        onMouseEnter={() => setHover(i)}
                        className={`relative transition-all duration-500 active:scale-[0.98] lg:active:scale-100 ${i === 1 ? 'lg:mt-14' : ''
                            } ${dimmed ? 'opacity-50 lg:scale-[0.97]' : ''}`}
                    >
                        <MediaFrame
                            src={card.src}
                            fallback={main}
                            alt={`${s.title} ${card.label}`}
                            from="bottom"
                            delay={i * 0.18}
                            className={aspect}
                        />
                        <motion.span
                            {...labelMotion}
                            className="absolute bottom-0 left-0 z-20 flex items-center gap-2 bg-obsidian/90 px-3 py-2 text-[10px] font-medium tracking-wide text-ivory sm:px-4 sm:py-2.5 sm:text-xs"
                        >
                            <span aria-hidden className="h-1.5 w-1.5 bg-champagne" />
                            {card.label}
                        </motion.span>
                    </div>
                )
            })}
        </div>
    )
}

/* Chooses one card or two cards depending on the service */
function Visual({ s, from, single, pairAspect }) {
    const media = mediaFor(s)
    if (media?.pair) return <PairFrame s={s} pair={media.pair} main={media.main} aspect={pairAspect} />
    return <MediaFrame name={s.img} src={media?.main} alt={s.title} from={from} className={single} />
}

/* Eyebrow, title, blurb, chips and button. Fades up in sequence on desktop only. */
function Copy({ s, index = 0, dark = false, split = false, className = '' }) {
    const animate = useAnimate()
    const heading = dark ? 'text-ivory' : 'text-obsidian'
    const body = dark ? 'text-ivory/85' : 'text-obsidian/80'
    const chip = dark
        ? 'border-ivory/25 text-ivory/90 hover:border-champagne hover:text-champagne'
        : 'border-obsidian/20 text-obsidian/85 hover:border-obsidian hover:bg-obsidian hover:text-ivory'
    const eyebrow = dark ? 'text-champagne' : 'text-obsidian/75'

    const wrapMotion = animate
        ? { variants: group, initial: 'hidden', whileInView: 'show', viewport: VIEWPORT }
        : {}
    const itemMotion = animate ? { variants: item } : {}

    const head = (
        <div>
            <motion.p
                {...itemMotion}
                className={`mb-3 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.25em] ${eyebrow}`}
            >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden className="h-px w-8 bg-current opacity-60" />
                <span>Service</span>
            </motion.p>
            <motion.h2
                {...itemMotion}
                className={`font-serif text-3xl leading-[1.08] sm:text-4xl lg:text-5xl xl:text-6xl ${heading}`}
            >
                {s.title}
            </motion.h2>
        </div>
    )

    const rest = (
        <>
            <motion.p
                {...itemMotion}
                className={`mt-4 max-w-md text-[15px] leading-relaxed sm:text-base ${body} ${split ? 'md:mt-6' : 'lg:mt-5'}`}
            >
                {s.blurb}
            </motion.p>
            <motion.ul {...itemMotion} className="mt-5 flex flex-wrap gap-2">
                {(s.points || []).slice(0, 4).map((p) => (
                    <li
                        key={p}
                        className={`border px-3 py-1.5 text-[11px] tracking-wide transition-colors duration-300 active:scale-95 sm:text-xs ${chip}`}
                    >
                        {p}
                    </li>
                ))}
            </motion.ul>
            <motion.div {...itemMotion} className="mt-6 sm:mt-8">
                <Link
                    to={`/services/${s.slug}`}
                    className="btn btn-gold w-full justify-center sm:w-auto"
                >
                    Explore {s.title}
                </Link>
            </motion.div>
        </>
    )

    return (
        <motion.div
            {...wrapMotion}
            className={`${split ? 'md:grid md:grid-cols-2 md:items-start md:gap-10 lg:gap-16' : ''} ${className}`}
        >
            {head}
            {split ? <div>{rest}</div> : rest}
        </motion.div>
    )
}

/* ---------- Four layouts (stack cleanly on mobile / tablet) ---------- */

/* 1. Image with a dark text card overlapping it (overlap only on desktop) */
function OverlapLayout({ s, index }) {
    return (
        <div className="grid items-center lg:grid-cols-12">
            <div className="lg:col-span-7">
                <Visual s={s} from="left" single="aspect-[4/3]" pairAspect="aspect-[4/5] lg:aspect-[3/4]" />
            </div>
            <Copy
                s={s}
                index={index}
                dark
                className="relative z-10 -mt-8 mx-3 bg-obsidian p-6 shadow-2xl sm:mx-8 sm:p-10 lg:col-span-6 lg:col-start-7 lg:mx-0 lg:mt-0 lg:-ml-20 lg:p-12"
            />
        </div>
    )
}

/* 2. Portrait image(s) with an offset outline frame, text on the left on desktop */
function PortraitLayout({ s, index }) {
    const hasPair = !!mediaFor(s)?.pair
    return (
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <Copy s={s} index={index} dark className="order-2 lg:order-1 lg:col-span-5" />
            <div className="relative order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
                {!hasPair && (
                    <div
                        aria-hidden
                        className="absolute inset-0 hidden translate-x-4 translate-y-4 border border-champagne/50 sm:block"
                    />
                )}
                <div className="relative z-10">
                    <Visual
                        s={s}
                        from="right"
                        single="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]"
                        pairAspect="aspect-[4/5] lg:aspect-[3/4]"
                    />
                </div>
            </div>
        </div>
    )
}

/* 3. Wide banner, title and details split underneath (two columns from tablet up) */
function WideLayout({ s, index }) {
    return (
        <div>
            <Visual
                s={s}
                from="bottom"
                single="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
                pairAspect="aspect-[4/5] sm:aspect-[4/3]"
            />
            <Copy s={s} index={index} split className={mediaFor(s)?.pair ? 'mt-8 lg:mt-20' : 'mt-8 lg:mt-10'} />
        </div>
    )
}

/* 4. Large image plus a smaller detail crop under the text (crop shown on desktop only) */
function DuoLayout({ s, index }) {
    const media = mediaFor(s)
    const accent = ACCENT_PHOTOS[index % ACCENT_PHOTOS.length]
    return (
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
                <Visual
                    s={s}
                    from="left"
                    single="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]"
                    pairAspect="aspect-[4/5] lg:aspect-[3/4]"
                />
            </div>
            <div className="lg:col-span-5 lg:col-start-8 lg:pt-10">
                <Copy s={s} index={index} dark />
                <div className="hidden lg:block">
                    {media?.main ? (
                        <MediaFrame
                            src={media.main}
                            alt={`${s.title} detail`}
                            from="bottom"
                            delay={0.15}
                            zoom={1.6}
                            position="center 25%"
                            className="mt-10 aspect-[16/10]"
                        />
                    ) : (
                        <MediaFrame
                            name={accent}
                            alt={`${s.title} detail`}
                            from="bottom"
                            delay={0.15}
                            className="mt-10 aspect-[16/10]"
                        />
                    )}
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

    /* Highlight the chip of the section currently on screen */
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

    /* Keep the active chip centered in the scrollable bar (mobile) */
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
                <p className="mx-auto max-w-7xl font-serif text-xl leading-snug text-obsidian sm:text-2xl lg:max-w-3xl lg:text-3xl lg:mx-0 lg:ml-[max(0px,calc((100%-80rem)/2))]">
                    Choose one service, or combine them for a complete look in a single visit. Everything here is for men and women.
                </p>
            </section>

            <div
                className="sticky z-30 border-y border-obsidian/10 bg-ivory/90 backdrop-blur"
                style={{ top: STICKY_TOP }}
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
                                className={`shrink-0 border px-4 py-2 text-xs font-medium tracking-wide transition-colors duration-300 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian ${on
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
            className={`scroll-mt-32 overflow-hidden py-10 sm:py-14 lg:py-24 ${dark ? 'bg-obsidian' : 'bg-ivory'}`}
        >
            <div className="mx-auto max-w-7xl px-5">
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
                        className="inline-flex items-center justify-center border border-obsidian/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory active:scale-95"
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