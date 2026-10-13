import { useMemo, useState } from 'react'
import { SITE, SERVICES, waLink, directions } from '../config'
import { useSeo } from '../components/ui'

const DAYS = ['Today', 'Tomorrow', 'This weekend']
const SLOTS = ['Morning', 'Afternoon', 'Evening']

const inputCls =
  'peer w-full rounded-none border-b-2 border-obsidian/20 bg-transparent px-1 pb-2 pt-6 text-lg outline-none transition-colors placeholder-transparent focus:border-obsidian'
const labelCls =
  'pointer-events-none absolute left-1 top-1 text-xs text-obsidian/60 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-obsidian'

const validate = d => {
  const e = {}
  if (d.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[+\d\s-]{10,15}$/.test(d.phone.trim())) e.phone = 'Enter a valid phone number, e.g. 98765 43210.'
  return e
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm transition duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian ${active
        ? 'border-obsidian bg-obsidian text-lime shadow-lg shadow-lime/30'
        : 'border-obsidian/25 bg-white text-obsidian hover:-translate-y-0.5 hover:border-obsidian hover:bg-lime/30'
        }`}
    >
      {children}
    </button>
  )
}

function QuickAction({ href, icon, title, text, external, dark }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group relative flex items-center gap-4 overflow-hidden p-5 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian ${dark ? 'bg-obsidian text-ivory' : 'bg-lime text-obsidian'
        }`}
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-2xl transition duration-300 group-hover:rotate-12 group-hover:scale-110 ${dark ? 'bg-lime text-obsidian' : 'bg-obsidian text-lime'
          }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-medium">{title}</span>
        <span className="block truncate text-sm opacity-70">{text}</span>
      </span>
      <span
        className="ml-auto text-2xl opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100"
        aria-hidden="true"
      >
        ›
      </span>
    </a>
  )
}

export default function Contact() {
  useSeo(
    'Contact & Appointments',
    'Enquire or plan a visit to Aora Luxe, a premium unisex salon in Yelahanka, Bengaluru. Call or WhatsApp +91 96861 35502.'
  )

  const [f, setF] = useState({
    name: '',
    phone: '',
    service: SERVICES[0]?.title || 'Other',
    day: '',
    date: '',
    slot: '',
    message: '',
  })
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const errors = useMemo(() => validate(f), [f])
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const bind = k => ({
    id: k,
    name: k,
    value: f[k],
    onChange: e => set(k, e.target.value),
    onBlur: () => setTouched(t => ({ ...t, [k]: true })),
  })
  const showErr = k => touched[k] && errors[k]

  const when = [f.date || f.day, f.slot && f.slot.toLowerCase()].filter(Boolean).join(', ')
  const message = useMemo(
    () =>
      `Hello Aora Luxe, I am ${f.name.trim() || '…'}. I would like to enquire about ${f.service}${when ? ' on ' + when : ''
        }. ${f.message.trim()} My number: ${f.phone.trim() || '…'}`
        .replace(/\s+/g, ' ')
        .trim(),
    [f, when]
  )

  const done = [!errors.name && f.name, !errors.phone && f.phone, f.service].filter(Boolean).length
  const progress = Math.round((done / 3) * 100)

  const submit = e => {
    e.preventDefault()
    setTouched({ name: true, phone: true })
    if (Object.keys(errors).length) {
      document.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    window.open(waLink(message), '_blank', 'noopener')
    setSent(true)
  }

  const reset = () => {
    setF({ name: '', phone: '', service: SERVICES[0]?.title || 'Other', day: '', date: '', slot: '', message: '' })
    setTouched({})
    setSent(false)
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SITE.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes aoraFloat { 0%,100% { transform: translate3d(0,0,0) scale(1) } 50% { transform: translate3d(30px,-24px,0) scale(1.12) } }
        @keyframes aoraPop { from { opacity: 0; transform: translateY(14px) scale(.97) } to { opacity: 1; transform: none } }
        @keyframes aoraShine { from { background-position: 0% 50% } to { background-position: 200% 50% } }
        .aora-blob { animation: aoraFloat 9s ease-in-out infinite }
        .aora-pop { animation: aoraPop .5s ease-out both }
        .aora-shine { background-size: 200% 100%; animation: aoraShine 4s linear infinite }
        @media (prefers-reduced-motion: reduce) { .aora-blob, .aora-pop, .aora-shine { animation: none } }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-obsidian px-5 pb-28 pt-44">
        <div className="aora-blob pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-lime/25 blur-3xl" aria-hidden="true" />
        <div
          className="aora-blob pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-champagne/25 blur-3xl"
          style={{ animationDelay: '-4s' }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="label text-champagne">Contact</p>
          <h1 className="mt-3 max-w-3xl text-5xl text-ivory sm:text-7xl">
            Plan your visit.
            <span className="aora-shine mt-2 block bg-gradient-to-r from-lime via-champagne to-lime bg-clip-text text-transparent">
              We'll save your chair.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ivory/85">
            Pick a service, choose a time, and send it straight to our WhatsApp. We usually reply within the hour during salon hours.
          </p>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="relative z-10 mx-auto -mt-12 grid max-w-7xl gap-4 px-5 md:grid-cols-3">
        <QuickAction href={SITE.tel} icon="☎" title="Call us" text={SITE.phone} dark />
        <QuickAction href={waLink()} icon="💬" title="WhatsApp" text="Chat with the team" external />
        <QuickAction href={directions} icon="📍" title="Get directions" text="Open in Google Maps" external dark />
      </section>

      {/* FORM + INFO */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {sent ? (
            <div className="aora-pop relative overflow-hidden bg-obsidian p-10 text-ivory shadow-2xl" role="status">
              <div className="aora-blob absolute -right-10 -top-10 h-48 w-48 rounded-full bg-lime/30 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-lime text-3xl text-obsidian" aria-hidden="true">✓</span>
                <h2 className="mt-6 text-4xl">WhatsApp is open.</h2>
                <p className="mt-3 max-w-md text-ivory/85">
                  Your message is ready to send, {f.name.trim().split(' ')[0]}. Tap send in WhatsApp and we'll confirm your slot.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a className="btn bg-lime text-obsidian" href={waLink(message)} target="_blank" rel="noreferrer">
                    Open WhatsApp again
                  </a>
                  <button type="button" onClick={reset} className="btn border border-ivory/40 text-ivory hover:bg-ivory/10">
                    Start a new enquiry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              aria-label="Appointment enquiry"
              className="space-y-9 border border-obsidian/10 bg-white p-6 shadow-2xl shadow-obsidian/10 sm:p-10"
            >
              {/* progress */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Book an appointment</span>
                  <span className="text-obsidian/75">{done} of 3 details ready</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-obsidian/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="relative">
                  <input {...bind('name')} placeholder=" " autoComplete="name" className={inputCls} aria-invalid={!!showErr('name')} aria-describedby="err-name" />
                  <label htmlFor="name" className={labelCls}>Your name</label>
                  <p id="err-name" role="alert" className="mt-1 min-h-[1.25rem] text-sm text-red-700">{showErr('name')}</p>
                </div>
                <div className="relative">
                  <input {...bind('phone')} type="tel" placeholder=" " autoComplete="tel" className={inputCls} aria-invalid={!!showErr('phone')} aria-describedby="err-phone" />
                  <label htmlFor="phone" className={labelCls}>Phone number</label>
                  <p id="err-phone" role="alert" className="mt-1 min-h-[1.25rem] text-sm text-red-700">{showErr('phone')}</p>
                </div>
              </div>

              <fieldset>
                <legend className="text-sm font-medium">What would you like?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...SERVICES.map(s => s.title), 'Other'].map(t => (
                    <Chip key={t} active={f.service === t} onClick={() => set('service', t)}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium">When suits you? <span className="font-normal text-obsidian/70">(optional)</span></legend>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {DAYS.map(d => (
                    <Chip key={d} active={f.day === d && !f.date} onClick={() => setF(p => ({ ...p, day: p.day === d ? '' : d, date: '' }))}>
                      {d}
                    </Chip>
                  ))}
                  <input
                    type="date"
                    aria-label="Pick a specific date"
                    min={new Date().toISOString().split('T')[0]}
                    value={f.date}
                    onChange={e => setF(p => ({ ...p, date: e.target.value, day: '' }))}
                    className={`rounded-full border px-4 py-2 text-sm transition focus:outline focus:outline-2 focus:outline-obsidian ${f.date ? 'border-obsidian bg-obsidian text-lime' : 'border-obsidian/25 bg-white'
                      }`}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SLOTS.map(s => (
                    <Chip key={s} active={f.slot === s} onClick={() => set('slot', f.slot === s ? '' : s)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <div className="relative">
                <textarea {...bind('message')} rows="3" maxLength={200} placeholder=" " className={`${inputCls} resize-none`} />
                <label htmlFor="message" className={labelCls}>Anything we should know? (optional)</label>
                <p className="mt-1 text-right text-xs text-obsidian/70">{f.message.length}/200</p>
              </div>

              {/* live preview */}
              <div>
                <p className="text-sm font-medium">Message preview</p>
                <div className="mt-2 rounded-2xl rounded-tl-sm bg-lime/30 p-4 text-sm leading-relaxed text-obsidian/80" aria-live="polite">
                  {message}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="btn group bg-obsidian text-lime transition duration-300 hover:-translate-y-0.5 hover:bg-charcoal hover:shadow-xl hover:shadow-lime/30">
                  Send via WhatsApp
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">›</span>
                </button>
                <p className="max-w-xs text-xs text-obsidian/75">
                  This opens WhatsApp with your message ready to send. Nothing is stored on this site.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* INFO */}
        <aside className="space-y-5 lg:col-span-2">
          <div className="relative overflow-hidden bg-obsidian p-8 text-ivory shadow-2xl">
            <div className="aora-blob absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lime/20 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-3xl">Aora Luxe</h2>
              <address className="mt-4 space-y-2 not-italic text-ivory/90">
                <p>{SITE.address}</p>
                <p><span className="text-champagne">Landmark:</span> {SITE.landmark}</p>
                <p className="flex items-start gap-2"><span aria-hidden="true">🕒</span>{SITE.hours}</p>
              </address>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={copyAddress} className="btn border border-ivory/40 text-ivory transition hover:bg-ivory/10">
                  {copied ? 'Address copied ✓' : 'Copy address'}
                </button>
                <a className="btn bg-lime text-obsidian transition hover:-translate-y-0.5" href={directions} target="_blank" rel="noreferrer">
                  Directions
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden border-4 border-lime shadow-2xl shadow-lime/20 transition duration-500 hover:shadow-lime/40">
            <iframe
              title="Aora Luxe location map"
              loading="lazy"
              className="h-80 w-full border-0 grayscale transition duration-500 hover:grayscale-0"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`}
            />
          </div>
        </aside>
      </section>
    </>
  )
}