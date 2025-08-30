import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, ShieldCheck, Sparkles } from 'lucide-react';

const ServicesSection = () => {
  const services = [{
    icon: <Facebook className="w-10 h-10 md:w-12 md:h-12" />,
    title: "Facebook Profiles",
    description: "Aged Facebook profiles for marketing and advertising. Verified and ready to use.",
    link: "/services/facebook-profiles"
  }, {
    icon: <ShieldCheck className="w-10 h-10 md:w-12 md:h-12" />,
    title: "Business Manager",
    description: "Verified Facebook Business Managers for secure ad campaign management.",
    link: "/services/business-manager"
  }, {
    icon: <Instagram className="w-10 h-10 md:w-12 md:h-12" />,
    title: "Facebook Pages",
    description: "Established Facebook pages with followers. Ideal for brand building and marketing.",
    link: "/services/facebook-pages"
  }, {
    icon: <Sparkles className="w-10 h-10 md:w-12 md:h-12" />,
    title: "Instagram Assets",
    description: "High-quality Instagram accounts and assets to boost your social media presence.",
    link: "/services/instagram-assets"
  }, {
    icon: <Sparkles className="w-10 h-10 md:w-12 md:h-12" />,
    title: "Custom Solutions",
    description: "Tailored social media solutions to meet your unique business requirements.",
    link: "/services/custom-solutions"
  }];

  const handleContactSupport = () => {
    window.open('https://t.me/chiphensir', '_blank');
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Our <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Supercharge your social media strategy with our premium assets. Gain an edge with verified profiles, business managers, and established pages.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {services.map((service, index) => (
            <Card key={index} className="bg-card/50 border-border/30 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group h-full">
              <CardContent className="p-4 md:p-6 lg:p-8 text-center relative">
                {/* Icon */}
                <div className="text-accent mb-4 md:mb-6 lg:mb-8 flex justify-center group-hover:scale-110 transition-transform duration-300 mt-2 md:mt-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    {React.cloneElement(service.icon, { 
                      className: "w-10 h-10 md:w-12 md:h-12" 
                    })}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4 lg:mb-6 leading-tight">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>
                
                {/* Learn More Button */}
                <Button 
                  variant="secondary" 
                  className="mt-4 cta-button"
                  onClick={() => window.location.href = service.link}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-card/20 border border-border/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm mx-4 md:mx-0">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
              Need Custom Solutions?
            </h3>
            <p className="text-gray-300 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Can't find what you're looking for? We offer custom social media asset solutions tailored to your specific needs.
            </p>
            <Button 
              className="cta-button text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
              onClick={handleContactSupport}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
