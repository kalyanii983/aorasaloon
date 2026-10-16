import { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react'
import { SITE, SERVICES, waLink } from '../config'
import { Photo, useSeo } from '../components/ui'
import AboutContent from '../components/AboutContent'
import ServicesContent from '../components/ServicesContent'

const Hero = ({ label, title, children, className = "pb-16 pt-44" }) => (
  <section className={`bg-obsidian px-5 ${className}`}><div className="mx-auto max-w-7xl"><p className="label text-champagne">{label}</p><h1 className="mt-3 max-w-3xl text-5xl text-ivory sm:text-6xl">{title}</h1>{children}</div></section>
)

export function About() {
  useSeo('About Aora Luxe', 'Meet Aora Luxe, a welcoming premium unisex salon for hair, beauty, nail art and makeup in Yelahanka, Bengaluru.')
  return (<>
    <Hero label="About" title="A salon built around personal style." className="pt-36 sm:pt-40 pb-4 sm:pb-6" />
    <AboutContent />
  </>)
}


export function Services() {
  useSeo('Salon Services in Yelahanka', 'Hair, beauty, nail art and makeup services at Aora Luxe, a premium unisex salon in Yelahanka, Bengaluru.')
  return (<>
    <Hero label="Services" title="Everything for your look, in one place." />
    <ServicesContent />
  </>)
}

export function ServiceDetail() {
  const s = SERVICES.find(x => x.slug === useParams().slug)
  useSeo(s ? s.title + ' in Yelahanka' : 'Service not found', s ? `${s.blurb} Aora Luxe, Yelahanka, Bengaluru.` : 'Service not found')
  if (!s) return <NotFound />
  return (<>
    <Hero label="Service" title={s.title}><p className="mt-5 max-w-xl text-muted">{s.blurb}</p></Hero>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2">
      <div><h2 className="text-3xl">What we offer</h2>
        <ul className="mt-6 divide-y divide-obsidian/15 border-y border-obsidian/15">{s.points.map(p => <li key={p} className="py-4">{p}</li>)}</ul>
        <p className="mt-4 text-sm text-obsidian/75">Ask us for the full list of treatments and availability.</p>
        <div className="mt-8 flex flex-wrap gap-3"><a className="btn btn-gold" href={waLink(`Hello Aora Luxe, I would like to enquire about ${s.title}.`)} target="_blank" rel="noreferrer">Enquire on WhatsApp</a>
          <Link className="btn border border-obsidian" to="/contact">Book an Appointment</Link></div>
        <p className="mt-8 text-sm">Also see: {SERVICES.filter(x => x.slug !== s.slug).map(x => <Link key={x.slug} className="mr-3 underline" to={`/services/${x.slug}`}>{x.title}</Link>)}</p></div>
      <Photo name={s.img} alt={s.title} className="aspect-[4/5]" />
    </section></>)
}

const GALLERY_ITEMS = [
  { id: 'g1', src: '/g1.jpeg', title: 'Sleek Silk Finish & Layers', category: 'Hair', tag: 'Haircut & Styling' },
  { id: 'g2', src: '/g2.jpeg', title: 'Caramel Honey Balayage Waves', category: 'Hair', tag: 'Balayage & Waves' },
  { id: 'g3', src: '/g3.jpeg', title: 'Dimensional Brunette Highlights', category: 'Hair', tag: 'Highlights & Tone' },
  { id: 'g4', src: '/g4.jpeg', title: 'Luxe Wavy Balayage Finish', category: 'Hair', tag: 'Hair Colour' },
  { id: 'g5', src: '/g5.jpeg', title: 'Golden Glam Waves', category: 'Hair', tag: 'Blowout & Styling' },
  { id: 'g6', src: '/g6.jpeg', title: 'Textured Volume Haircut', category: 'Hair', tag: 'Haircut' },
  { id: 'g7', src: '/g7.jpeg', title: 'Gloss Treatment & Silk Press', category: 'Hair', tag: 'Hair Treatment' },
  { id: 'g8', src: '/g8.jpeg', title: 'Mocha Radiance Highlights', category: 'Hair', tag: 'Colour & Styling' },
  { id: 'g9', src: '/g9.jpeg', title: 'Glossy Layered Brunette', category: 'Hair', tag: 'Haircut & Finish' },
  { id: 'g10', src: '/g10.jpeg', title: 'Precision Cut & Face-Framing', category: 'Hair', tag: 'Precision Cut' },
  { id: 'g11', src: '/g11.jpeg', title: 'Champagne Blonde Balayage', category: 'Hair', tag: 'Balayage' },
  { id: 'g12', src: '/g12.jpeg', title: 'Deep Burgundy Velvet Tone', category: 'Hair', tag: 'Vibrant Colour' },
  { id: 'g13', src: '/g13.jpg', title: 'Hydrating Gloss & Frizz Control (Before/After)', category: 'Hair', tag: 'Gloss Treatment' },
  { id: 'g14', src: '/g14.jpg', title: 'Keratin Smoothening Transformation (Before/After)', category: 'Hair', tag: 'Keratin & Smoothing' },
  { id: 'g15', src: '/g15.jpg', title: 'Silk Press & Deep Nourishing (Before/After)', category: 'Hair', tag: 'Silk Press' },
  { id: 'nail1', src: '/nail.png', title: 'Bespoke Floral Gel Nail Art', category: 'Nails', tag: 'Nail Art' },
]

export function Gallery() {
  useSeo('Gallery & Client Transformations', 'Browse real client hairstyles, balayage, colours and nail art at Aora Luxe salon in Yelahanka, Bengaluru.')
  const [filter, setFilter] = useState('All')
  const [activeIdx, setActiveIdx] = useState(null)

  const items = filter === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(it => it.category === filter)

  const handlePrev = useCallback(() => {
    setActiveIdx(prev => (prev === null ? null : (prev - 1 + items.length) % items.length))
  }, [items.length])

  const handleNext = useCallback(() => {
    setActiveIdx(prev => (prev === null ? null : (prev + 1) % items.length))
  }, [items.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (activeIdx === null) return
      if (e.key === 'Escape') setActiveIdx(null)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIdx, handlePrev, handleNext])

  const activeItem = activeIdx !== null ? items[activeIdx] : null

  return (
    <>
      <Hero
        label="Portfolio & Transformations"
        title="A look at the Aora Luxe experience."
        className="pt-36 sm:pt-40 pb-10"
      >
        <p className="mt-4 max-w-2xl text-base text-ivory/70 sm:text-lg">
          Browse real client hair makeovers, dimensional balayage, precision cuts, and bespoke nail artistry crafted with care in Yelahanka, Bengaluru.
        </p>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {[
            { id: 'All', label: `All Looks (${GALLERY_ITEMS.length})` },
            { id: 'Hair', label: `Hair & Colour (${GALLERY_ITEMS.filter(it => it.category === 'Hair').length})` },
            { id: 'Nails', label: `Nail Art (${GALLERY_ITEMS.filter(it => it.category === 'Nails').length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id)
                setActiveIdx(null)
              }}
              className={`rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${
                filter === tab.id
                  ? 'bg-lime text-obsidian shadow-lg shadow-lime/20 font-semibold'
                  : 'bg-charcoal/60 text-ivory/80 border border-ivory/15 hover:border-lime/40 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Hero>

      {/* Gallery Grid */}
      <section className="bg-obsidian pb-24 pt-4 px-5">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-ivory/10 bg-charcoal aspect-[3/4] shadow-md transition-all duration-500 hover:border-lime/40 hover:shadow-xl hover:shadow-lime/10"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/25 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                {/* Category tag */}
                <span className="absolute left-3 top-3 rounded-full border border-ivory/20 bg-obsidian/70 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-champagne backdrop-blur-md">
                  {item.tag}
                </span>

                {/* Hover zoom cue */}
                <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-obsidian/70 text-ivory/80 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:text-lime">
                  <Sparkles size={13} />
                </div>

                {/* Bottom captions */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left">
                  <h3 className="font-serif text-sm sm:text-base font-medium text-ivory leading-snug drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-lime transition-transform duration-300 group-hover:translate-x-0.5">
                    View photo & book →
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom callout */}
          <div className="mt-16 rounded-2xl border border-ivory/15 bg-charcoal/40 p-8 text-center backdrop-blur-sm sm:p-12">
            <h2 className="font-serif text-2xl text-ivory sm:text-3xl">Like any of these styles?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ivory/70 sm:text-base">
              Send us a screenshot or message on WhatsApp and our senior stylists will recreate or customize it to your features.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={waLink('Hello Aora Luxe, I saw your gallery and would like to book a consultation.')}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold inline-flex items-center gap-2"
              >
                <MessageCircle size={16} /> Enquire on WhatsApp
              </a>
              <Link to="/contact" className="btn border border-ivory/30 text-ivory hover:border-lime hover:text-lime">
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95 p-4 sm:p-8 backdrop-blur-xl"
            onClick={() => setActiveIdx(null)}
          >
            {/* Top header bar */}
            <div
              className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 text-ivory border-b border-ivory/10 z-10 bg-obsidian/80 backdrop-blur-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-lime/15 border border-lime/30 px-2.5 py-0.5 font-mono text-xs text-lime">
                  {activeItem.tag}
                </span>
                <span className="hidden font-serif text-sm text-ivory sm:inline">
                  {activeItem.title}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-ivory/60">
                  {activeIdx + 1} / {items.length}
                </span>
                <button
                  onClick={() => setActiveIdx(null)}
                  className="rounded-full bg-charcoal/80 p-2 text-ivory hover:text-lime hover:bg-charcoal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Nav Arrows */}
            <button
              onClick={e => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-charcoal/80 p-3 text-ivory hover:text-lime hover:bg-obsidian border border-ivory/15 backdrop-blur-md transition-all shadow-xl"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={e => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-charcoal/80 p-3 text-ivory hover:text-lime hover:bg-obsidian border border-ivory/15 backdrop-blur-md transition-all shadow-xl"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>

            {/* Main Modal Image Box */}
            <div
              className="relative max-h-[75vh] sm:max-h-[82vh] max-w-4xl overflow-hidden rounded-2xl border border-ivory/15 shadow-2xl mt-10"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={activeItem.src}
                alt={activeItem.title}
                className="max-h-[72vh] sm:max-h-[78vh] w-auto max-w-full object-contain mx-auto"
              />

              {/* Bottom bar inside modal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-obsidian/95 border-t border-ivory/10 px-5 py-3 text-center sm:text-left">
                <div>
                  <h4 className="font-serif text-base sm:text-lg text-ivory font-medium">
                    {activeItem.title}
                  </h4>
                </div>
                <a
                  href={waLink(`Hello Aora Luxe, I saw this look "${activeItem.title}" in your gallery and would like to book an appointment for it.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-gold text-xs py-2 px-4 inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <MessageCircle size={14} /> Book this look
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Privacy() {
  useSeo('Privacy Policy', 'How Aora Luxe handles enquiry information.')
  return (<><Hero label="Legal" title="Privacy Policy" />
    <section className="mx-auto max-w-3xl space-y-4 px-5 py-16 text-obsidian/80">
      <p>The enquiry form on this site does not store your details. When you submit it, your name, phone number, preferred service and message are placed into a WhatsApp message that you choose to send to Aora Luxe.</p>
      <p>We only use that information to reply to your enquiry. For questions, call {SITE.phone}.</p>
      <p className="text-sm text-obsidian/50">Draft: client/legal review needed before launch.</p>
    </section></>)
}

export function NotFound() {
  useSeo('Page not found', 'This page could not be found.')
  return (<section className="grid min-h-screen place-items-center bg-obsidian px-5 text-center"><div><h1 className="text-6xl text-lime">404</h1><p className="mt-3 text-muted">This page could not be found.</p><Link to="/" className="btn btn-gold mt-6">Back to home</Link></div></section>)
}