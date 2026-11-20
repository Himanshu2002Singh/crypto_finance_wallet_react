import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { WhyChooseSection } from '../components/landing/WhyChooseSection';
import { InvestmentPlansSection } from '../components/landing/InvestmentPlansSection';
import { InvestorSection } from '../components/landing/InvestorSection';
import { BlogSection } from '../components/landing/BlogSection';
import { NewsletterSection } from '../components/landing/NewsletterSection';
import { FAQSection } from '../components/landing/FAQSection';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhyChooseSection />
      <InvestmentPlansSection />
      <InvestorSection />
      <BlogSection />
      <NewsletterSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
