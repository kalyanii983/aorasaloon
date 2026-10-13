import { Reveal } from '../ui'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE, WHY, spot, Icon } from './shared'

const WHY_THEMES = [
  { c: '212,185,120', tag: 'Tailored to you' },      // gold
  { c: '244,114,148', tag: 'Everything together' },  // rose
  { c: '52,211,153', tag: 'Everyone welcome' },     // emerald
  { c: '167,139,250', tag: 'Easy to find' },         // violet
  { c: '56,189,248', tag: 'One tap away' },         // sky
]

/* Responsive spans: 2-col (sm) last card full width; 3-col (lg) last card spans 2; 5-col (xl) all equal */
const WHY_SPANS = [
  '',
  '',
  '',
  '',
  'sm:col-span-2 lg:col-span-2 xl:col-span-1',
]

function WhyCard({ item, theme, i, className = '' }) {
  return (
    <motion.li
      onMouseMove={spot}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      whileHover={{ y: -8 }}
      style={{
        '--c': theme.c,
        background: 'linear-gradient(150deg, rgba(var(--c),0.20), rgba(var(--c),0.05) 55%, rgba(14,14,14,0.7))',
        borderColor: 'rgba(var(--c),0.28)',
      }}
      className={`group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-2xl border p-5 ${className}`}
    >
      {/* colour glow blob */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-70 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100"
        style={{ background: 'rgba(var(--c),0.35)' }}
      />
      {/* cursor spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--c),0.28), transparent 70%)' }}
      />
      {/* bright outline on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(var(--c),0.75)' }}
      />

      {/* top row: icon + number */}
      <div className="relative flex items-start justify-between">
        <span
          className="grid h-11 w-11 place-items-center rounded-xl border transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:!bg-[rgb(var(--c))] group-hover:!text-[#0e0e0e]"
          style={{ background: 'rgba(var(--c),0.18)', borderColor: 'rgba(var(--c),0.45)', color: 'rgb(var(--c))' }}
        >
          <Icon name={item.icon} />
        </span>
        <span className="font-mono text-[11px] tracking-widest" style={{ color: 'rgba(var(--c),0.9)' }}>0{i + 1}</span>
      </div>

      {/* text */}
      <div className="relative mt-6">
        <p className="label mb-2 text-[9px] tracking-[0.22em]" style={{ color: 'rgb(var(--c))' }}>{theme.tag}</p>
        <p className="font-serif text-xl leading-snug text-ivory">{item.t}</p>
      </div>

      {/* bottom line draws in on hover */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
        style={{ background: 'rgb(var(--c))' }}
      />
    </motion.li>
  )
}

export default function WhySection() {
  return (
    <section className="relative overflow-hidden bg-obsidian">
      {/* multicolour ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-[360px] w-[360px] rounded-full blur-[130px]" style={{ background: 'rgba(244,114,148,0.12)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/3 h-[380px] w-[380px] rounded-full blur-[140px]" style={{ background: 'rgba(167,139,250,0.12)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 h-[340px] w-[340px] rounded-full blur-[130px]" style={{ background: 'rgba(52,211,153,0.10)' }} />

      <div className="relative mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label text-[11px] tracking-[0.28em] text-champagne">Why choose us</p>
              <h2 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">Why <span className="italic text-champagne">Aora Luxe?</span></h2>
            </div>
            <p className="max-w-sm text-ivory/80">Everything you need for your look, in one welcoming place.</p>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:grid-cols-5">
          {WHY.map((w, i) => (
            <WhyCard
              key={w.t}
              item={w}
              theme={WHY_THEMES[i % WHY_THEMES.length]}
              i={i}
              className={WHY_SPANS[i] || ''}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
