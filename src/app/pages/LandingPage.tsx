import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { WhyChooseSection } from '../components/landing/WhyChooseSection';
import { InvestmentPlansSection } from '../components/landing/InvestmentPlansSection';
import { BlogSection } from '../components/landing/BlogSection';
import { NewsletterSection } from '../components/landing/NewsletterSection';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhyChooseSection />
      <InvestmentPlansSection />
      <BlogSection />
      <NewsletterSection />
      <CTASection />
      <Footer />
    </div>
  );
}
