import { useTranslations } from 'next-intl';
import HashScrollOnMount     from '@/components/home/hash-scroll-on-mount';
import HeroSection           from '@/components/home/HeroSection';
import TrustStrip        from '@/components/home/TrustStrip';
import ProblemSection    from '@/components/home/ProblemSection';
import ComparisonTable   from '@/components/home/ComparisonTable';
import ServicesSection   from '@/components/home/ServicesSection';
import QuoteCalculator   from '@/components/home/QuoteCalculator';
import ProcessSection    from '@/components/home/ProcessSection';
import DiveBridgeSection from '@/components/home/DiveBridgeSection';
import PortfolioSection  from '@/components/home/PortfolioSection';
import AboutSection      from '@/components/home/AboutSection';
import GuaranteeSection  from '@/components/home/GuaranteeSection';
import FaqSection        from '@/components/home/FaqSection';
import FinalCtaSection   from '@/components/home/FinalCtaSection';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <>
      <HashScrollOnMount />
      <HeroSection
        headline={t('hero.h1')}
        h1Accents={t('hero.h1Accents')}
        sub={t('hero.sub')}
        ctaPrimary={t('hero.ctaPrimary')}
        ctaSecondary={t('hero.ctaSecondary')}
        trustItems={[t('trust.item1'), t('trust.item2'), t('trust.item3')]}
      />
      <TrustStrip />
      <ProblemSection />
      <ComparisonTable />
      <ServicesSection />
      <QuoteCalculator />
      <ProcessSection />
      <DiveBridgeSection />
      <PortfolioSection />
      <AboutSection />
      <GuaranteeSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
