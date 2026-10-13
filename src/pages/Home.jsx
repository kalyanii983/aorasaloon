import { useRef } from 'react'
import { useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useSeo } from '../components/ui'
import {
  HeroSection,
  AboutSection,
  ServicesSection,
  FeatureBandSection,
  WhySection,
  ReviewsSection,
  VisitSection,
  FinalCtaSection,
  ScrollSection,
  ScrollProgress,
  useIsDesktop,
} from '../components/home'

export default function Home() {
  useSeo('Premium Unisex Salon in Yelahanka, Bengaluru', 'Aora Luxe: premium hair, beauty, nail art and makeup services in Yelahanka, Bengaluru. Enquire on WhatsApp.')

  const heroRef = useRef(null)
  const reduce = useReducedMotion()
  const isDesktop = useIsDesktop()
  const scrollAnim = isDesktop && !reduce /* section scroll animations: desktop only */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '6%'])
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-12%'])
  const heroFade = useTransform(scrollYProgress, [0, 0.75], [1, scrollAnim ? 0.1 : 1])
  const heroLift = useTransform(scrollYProgress, [0, 1], ['0%', scrollAnim ? '-8%' : '0%'])

  return (
    <div className="overflow-x-clip">
      {scrollAnim && <ScrollProgress />}

      {/* ───────── HERO ───────── */}
      <HeroSection
        heroRef={heroRef}
        scrollAnim={scrollAnim}
        photoY={photoY}
        wordY={wordY}
        heroFade={heroFade}
        heroLift={heroLift}
      />

      {/* ───────── ABOUT ───────── */}
      <ScrollSection on={scrollAnim} from="up">
        <AboutSection />
      </ScrollSection>

      {/* ───────── SERVICES ───────── */}
      <ScrollSection on={scrollAnim} from="scale">
        <ServicesSection />
      </ScrollSection>

      {/* ───────── FEATURE BAND ───────── */}
      <ScrollSection on={scrollAnim} from="clip">
        <FeatureBandSection />
      </ScrollSection>

      {/* ───────── WHY ───────── */}
      <ScrollSection on={scrollAnim} from="up">
        <WhySection />
      </ScrollSection>

      {/* ───────── REVIEWS ───────── */}
      <ScrollSection on={scrollAnim} from="scale">
        <ReviewsSection />
      </ScrollSection>

      {/* ───────── VISIT ───────── */}
      <ScrollSection on={scrollAnim} from="up">
        <VisitSection />
      </ScrollSection>

      {/* ───────── FINAL CTA ───────── */}
      <ScrollSection on={scrollAnim} from="up">
        <FinalCtaSection />
      </ScrollSection>
    </div>
  )
}