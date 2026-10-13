import { Reveal } from '../ui'
import { SITE, directions, waLink } from '../../config'

export default function VisitSection() {
  return (
    <section className="border-t border-ivory/10 bg-obsidian">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 lg:px-14 lg:py-32">
        <Reveal>
          <h2 className="font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">Your beauty destination <span className="italic text-champagne">in Yelahanka.</span></h2>
          <address className="mt-8 space-y-2 not-italic text-ivory/85">
            <p>{SITE.address}</p>
            <p>Landmark: {SITE.landmark}</p>
            <p>Hours: {SITE.hours}</p>
            <p><a className="text-ivory underline decoration-champagne/60 underline-offset-4 hover:text-champagne" href={SITE.tel}>{SITE.phone}</a></p>
          </address>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn rounded-full bg-champagne text-obsidian transition-colors hover:bg-ivory" href={directions} target="_blank" rel="noreferrer">Get Directions</a>
            <a className="btn rounded-full border border-ivory/25 text-ivory transition-colors hover:border-champagne hover:text-champagne" href={waLink()} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <iframe title="Aora Luxe location map" loading="lazy" className="h-72 w-full rounded-[1.5rem] border-0 grayscale invert-[0.92] contrast-[0.9] sm:h-80 md:h-full md:min-h-[360px]" src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`} />
        </Reveal>
      </div>
    </section>
  )
}
