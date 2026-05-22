import { Linkedin } from 'lucide-react';

export function InvestorSection() {
  return (
    <section id="investor" className="bg-gray-50 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        
        {/* <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"> */}
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <div className="aspect-[3/4] w-full sm:aspect-[4/5] lg:aspect-[3/4]">
            <img
              src="/images/investor.jpeg"
              alt="Mack Panwar"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-purple-600">
            Investor Profile
          </p>

          <h2 className="mb-5 text-3xl font-bold text-gray-900 md:text-4xl">
            Mack Panwar
          </h2>

          <p className="mb-5 text-lg leading-8 text-gray-600">
            Mack Panwar is associated with InvestPro as an investor focused on
            disciplined growth, practical planning, and long-term portfolio
            confidence. His approach emphasizes clear decision-making,
            transparent opportunities, and steady value creation for investors.
          </p>

          <p className="mb-8 text-gray-600">
            Through InvestPro, Mack supports a simple investment experience
            where users can review plans, understand assigned returns, and
            track referral benefits from one dashboard.
          </p>

          <a
            href="https://www.linkedin.com/in/demo-profile"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            <Linkedin className="h-5 w-5" />
            LinkedIn Profile
          </a>
        </div>
      </div>
    </section>
  );
}