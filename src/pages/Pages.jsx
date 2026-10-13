import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

const TILES = [['hair', 'Hairstyling', 'row-span-2'], ['nails', 'Nail art', ''], ['makeup', 'Makeup', ''], ['interior', 'Salon interior', 'row-span-2'], ['beauty', 'Beauty', ''], ['feature', 'Hair colour', '']]
export function Gallery() {
  useSeo('Gallery', 'Browse hairstyling, colour, nail art, makeup and salon moments from Aora Luxe, Yelahanka, Bengaluru.')
  const [sel, setSel] = useState(null)
  useEffect(() => { const k = e => e.key === 'Escape' && setSel(null); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [])
  return (<>
    <Hero label="Gallery" title="A look at the Aora Luxe experience." />
    <section className="mx-auto grid max-w-7xl auto-rows-[200px] grid-cols-2 gap-3 px-5 py-16 md:grid-cols-3">
      {TILES.map(([n, a, span]) => (
        <button key={n} onClick={() => setSel([n, a])} aria-label={`Open ${a} image`} className={`${span} relative text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime`}>
          <Photo name={n} alt={a} className="h-full w-full" /></button>))}
    </section>
    {sel && (
      <div role="dialog" aria-modal="true" aria-label={sel[1]} className="fixed inset-0 z-50 grid place-items-center bg-obsidian/95 p-5" onClick={() => setSel(null)}>
        <button autoFocus className="absolute right-5 top-5 text-lime" onClick={() => setSel(null)}>Close ✕</button>
        <Photo name={sel[0]} alt={sel[1]} className="h-[80vh] w-full max-w-4xl" />
      </div>)}
  </>)
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