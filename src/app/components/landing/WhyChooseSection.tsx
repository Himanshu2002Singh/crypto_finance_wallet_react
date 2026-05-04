import { whyChooseFeatures } from '../../../data/mockData';

export function WhyChooseSection() {
  return (
    <section id="why-us" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose InvestPro?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide secure, transparent, and profitable investment opportunities in the
            cryptocurrency market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition text-center"
            >
              <div
                className={`w-20 h-20 ${feature.iconBg} rounded-full flex items-center justify-center text-4xl mx-auto mb-6`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
