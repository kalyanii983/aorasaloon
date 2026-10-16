import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, MessageCircle, MapPin, Phone, Clock, Instagram, ArrowUpRight, ArrowUp } from 'lucide-react'
import { SITE, SERVICES, waLink, directions } from '../config'
import { Logo } from './ui'

const NAV = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/gallery', 'Gallery'], ['/contact', 'Contact']]

function Header() {
  const [solid, setSolid] = useState(false), [open, setOpen] = useState(false)
  useEffect(() => { const f = () => setSolid(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  const link = ({ isActive }) => `label py-2 border-b ${isActive ? 'border-lime text-lime' : 'border-transparent text-ivory hover:text-lime'}`

  const handleNavClick = () => {
    setOpen(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="bg-gradient-to-r from-[#B99547] via-[#F2D78E] to-[#B99547] text-obsidian text-center label py-2 font-bold tracking-[0.25em] shadow-sm">Premium unisex salon · Yelahanka, Bengaluru</div>
      <div className={`transition-colors duration-500 ${solid || open ? 'bg-obsidian' : 'bg-gradient-to-b from-obsidian/80 to-transparent'}`}>
        <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" aria-label="Aora Luxe home" onClick={handleNavClick}><Logo /></Link>
          <div className="hidden items-center gap-8 md:flex">
            {NAV.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={link}>{l}</NavLink>)}
            <Link to="/contact" className="btn btn-gold">Book an Appointment</Link>
          </div>
          <button className="text-lime md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden md:hidden">
              <div className="flex flex-col gap-4 px-5 pb-6">
                {NAV.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} onClick={handleNavClick} className={link}>{l}</NavLink>)}
                <Link to="/contact" onClick={handleNavClick} className="btn btn-gold">Book an Appointment</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

/* ---------- Footer pieces ---------- */

/* Column heading with a small champagne accent line */
function FHeading({ children }) {
  return (
    <h3 className="label mb-5 flex items-center gap-3 text-champagne">
      <span aria-hidden className="h-px w-6 bg-champagne/60" />
      {children}
    </h3>
  )
}

/* Link with a lime line that slides in on hover */
function FLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-0 text-[15px] text-ivory/85 transition-all duration-300 hover:gap-2 hover:text-lime"
    >
      <span aria-hidden className="h-px w-0 bg-lime transition-all duration-300 group-hover:w-3" />
      {children}
    </Link>
  )
}

/* Contact row with an icon box */
function InfoRow({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/15 text-lime">
        <Icon size={16} aria-hidden />
      </span>
      <span className="pt-1.5 text-[15px] leading-snug text-ivory/90">{children}</span>
    </li>
  )
}

const pill =
  'inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-xs font-medium tracking-wide text-ivory transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-obsidian active:scale-95'

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-obsidian text-ivory/85">
      {/* soft glow */}
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-lime/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5">
        {/* CTA panel */}
        <div className="-translate-y-0 border-x border-b border-white/10 bg-white/[0.03] px-6 py-8 sm:px-10 sm:py-10 md:flex md:items-center md:justify-between md:gap-8 lg:mt-0">
          <div>
            <p className="label text-lime">Ready when you are</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ivory sm:text-4xl">
              Your best look starts with one visit.
            </h2>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0 md:shrink-0">
            <Link to="/contact" className="btn btn-gold justify-center">Book an Appointment</Link>
            <a
              href={waLink('Hello Aora Luxe, I would like to book an appointment.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-ivory/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:border-lime hover:text-lime active:scale-95"
            >
              <MessageCircle size={14} aria-hidden /> WhatsApp us
            </a>
          </div>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-x-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ivory/85">
              Hair · Beauty · Nails · Arts · Makeup. A premium unisex salon in Yelahanka, Bengaluru, where every visit
              feels a little more luxe.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SITE.tel && (
                <a href={SITE.tel} className={pill}>
                  <Phone size={14} aria-hidden /> Call us
                </a>
              )}
              {SITE.instagram && (
                <a href={SITE.instagram} target="_blank" rel="noreferrer" className={pill}>
                  <Instagram size={14} aria-hidden /> Instagram
                </a>
              )}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 lg:col-start-6">
            <FHeading>Explore</FHeading>
            <ul className="space-y-3">
              {NAV.map(([to, l]) => (
                <li key={to}><FLink to={to}>{l}</FLink></li>
              ))}
              <li><FLink to="/privacy-policy">Privacy Policy</FLink></li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <FHeading>Services</FHeading>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}><FLink to={`/services/${s.slug}`}>{s.title}</FLink></li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <address className="col-span-2 not-italic lg:col-span-3">
            <FHeading>Visit us</FHeading>
            <ul className="space-y-4">
              <InfoRow icon={MapPin}>
                {SITE.address}
                {SITE.landmark && <span className="mt-0.5 block text-ivory/75">{SITE.landmark}</span>}
              </InfoRow>
              {SITE.phone && (
                <InfoRow icon={Phone}>
                  <a className="transition-colors hover:text-lime" href={SITE.tel}>{SITE.phone}</a>
                </InfoRow>
              )}
              {SITE.hours && <InfoRow icon={Clock}>{SITE.hours}</InfoRow>}
            </ul>
            <a
              className="group mt-6 inline-flex items-center gap-1.5 border-b border-lime pb-1 text-sm font-medium text-lime transition-colors hover:text-champagne hover:border-champagne"
              href={directions}
              target="_blank"
              rel="noreferrer"
            >
              Get directions
              <ArrowUpRight size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </address>
        </div>
      </div>

      {/* Big faint wordmark */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden whitespace-nowrap text-center font-serif text-[17vw] leading-[0.85] tracking-tight text-transparent lg:text-[13rem]"
        style={{ WebkitTextStroke: '1px rgba(255,255,255,0.10)' }}
      >
        AORA LUXE
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 py-5 pb-24 text-xs text-ivory/75 sm:flex-row sm:justify-between sm:pb-5 sm:pr-24">
          <p>© {new Date().getFullYear()} Aora Luxe. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="transition-colors hover:text-lime">Privacy Policy</Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 transition-colors hover:text-lime"
            >
              Back to top
              <span className="grid h-7 w-7 place-items-center border border-white/20 transition-colors group-hover:border-lime">
                <ArrowUp size={14} aria-hidden />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
      <a href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-tr from-[#B5934C] via-[#E8C87A] to-[#D7B56F] text-obsidian shadow-xl shadow-lime/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-lime/50"><MessageCircle /></a>
    </>
  )
}