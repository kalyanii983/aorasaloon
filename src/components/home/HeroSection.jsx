import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { waLink } from '../../config'
import { EASE, HEADLINE, Line, Arrow, useIsDesktop } from './shared'

export default function HeroSection({ heroRef, scrollAnim, photoY, wordY, heroFade, heroLift }) {
  return (
    <section ref={heroRef} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-obsidian">
      <motion.div
        style={{ y: photoY }}
        className="absolute -z-10 inset-x-0 -top-[4%] h-[62svh] sm:h-[66svh] lg:inset-y-0 lg:left-auto lg:right-0 lg:top-[-4%] lg:h-[108%] lg:w-[64%] xl:w-[60%]"
      >
        <motion.div initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.6, ease: EASE }} className="h-full w-full">
          <img
            src="/heroimg.png"
            alt="Stylist working with a client at Aora Luxe salon"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[78%_18%] sm:object-[80%_22%] lg:object-[88%_30%]"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/40 via-transparent via-[28%] to-obsidian to-[66%] lg:hidden" />
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-obsidian from-[30%] via-obsidian/50 via-[45%] to-transparent to-[68%] lg:block" />
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-t from-obsidian/80 via-transparent to-obsidian/40 lg:block" />

      <motion.div
        style={{ opacity: heroFade, y: heroLift }}
        className="relative mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-end px-5 pb-28 pt-[50svh] sm:px-8 sm:pb-32 sm:pt-[56svh] lg:justify-center lg:px-14 lg:pb-56 lg:pt-36"
      >
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="flex items-center gap-4">
          <span className="label text-[10px] tracking-[0.24em] text-ivory sm:text-[11px] sm:tracking-[0.28em]">Hair · Beauty · Nails · Makeup</span>
          <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5, ease: EASE }} style={{ originX: 0 }} className="hidden h-px w-10 bg-champagne sm:block" />
        </motion.div>

        <h1 className="mt-4 max-w-[14ch] font-serif text-[clamp(2.5rem,10vw,7.5rem)] font-medium leading-[1] tracking-tight text-ivory sm:mt-6 lg:mt-7 lg:max-w-[13ch] lg:text-[clamp(3.5rem,7.2vw,7.5rem)]">
          {HEADLINE.map((l, i) => (
            <Line key={l} i={i} accent={i === HEADLINE.length - 1}>{l}</Line>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7 }} className="mt-5 max-w-md text-sm leading-relaxed text-ivory/85 sm:text-[15px] lg:mt-7">
          A unisex salon for hair, beauty, nail art and makeup in Yelahanka, Bengaluru. Unhurried, precise, and made around you.
        </motion.p>

        <motion.a
          href={waLink()}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          whileHover={{ y: -2 }}
          className="group mt-7 inline-flex max-w-full items-center gap-3 self-start rounded-full border border-ivory/15 bg-obsidian/50 py-2 pl-4 pr-2 backdrop-blur-md transition-colors hover:border-champagne/60 sm:gap-4 sm:pl-5 lg:mt-9"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
          <span className="label hidden text-[10px] tracking-[0.22em] text-ivory/80 min-[420px]:inline">Book your visit</span>
          <span className="truncate font-serif text-base text-ivory">Enquire on WhatsApp</span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-champagne text-obsidian transition-transform duration-300 group-hover:rotate-45"><Arrow /></span>
        </motion.a>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/contact" className="text-ivory underline decoration-champagne/60 underline-offset-8 transition-colors hover:text-champagne">Book Your Experience</Link>
          <Link to="/services" className="text-ivory/85 underline decoration-ivory/30 underline-offset-8 transition-colors hover:text-champagne">Explore Our Services</Link>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: wordY }}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-[14%] select-none px-[2vw]"
      >
        <p className="whitespace-nowrap text-center font-serif text-[19vw] font-medium uppercase leading-[0.8] tracking-[-0.02em] text-ivory/90 sm:text-[15.5vw]">Aora Luxe</p>
      </motion.div>
    </section>
  )
}
