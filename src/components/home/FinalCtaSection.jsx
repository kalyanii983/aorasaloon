import { Reveal } from '../ui'
import { SITE, directions, waLink } from '../../config'
import { motion, useReducedMotion } from 'framer-motion'
import { PillButton } from './shared'

export default function FinalCtaSection() {
  const reduce = useReducedMotion()
  return (
    <section className="relative overflow-hidden border-t border-ivory/10 bg-charcoal px-5 py-20 sm:px-8 lg:py-32">
      {/* ambient glows + faint grid */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/10 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(244,239,230,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,230,1) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />

      {/* rotating rings */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-champagne/20 sm:h-[760px] sm:w-[760px]" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} />
      <motion.div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/10 sm:h-[520px] sm:w-[520px]" animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="label inline-flex items-center gap-3 rounded-full border border-ivory/15 bg-obsidian/40 px-4 py-2 text-[10px] tracking-[0.26em] text-ivory/80 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
            </span>
            Yelahanka, Bengaluru
          </p>

          <h2 className="mx-auto mt-7 max-w-3xl font-serif text-4xl leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
            Ready for your next <span className="italic text-champagne">signature look?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-ivory/80">Connect with Aora Luxe to enquire about services and plan your salon visit.</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <PillButton href={waLink()}>Chat on WhatsApp</PillButton>
            <PillButton href={directions} variant="ghost">Get Directions</PillButton>
          </div>

          <p className="mt-8 text-sm text-ivory/75">
            Prefer a call?{' '}
            <a href={SITE.tel} className="text-ivory underline decoration-champagne/60 underline-offset-4 transition-colors hover:text-champagne">{SITE.phone}</a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
