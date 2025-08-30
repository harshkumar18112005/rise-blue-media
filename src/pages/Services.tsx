
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Facebook, Instagram, ShieldCheck, Sparkles, Users, TrendingUp } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Facebook className="w-12 h-12" />,
      title: "Facebook Profiles",
      description: "Aged Facebook profiles for marketing and advertising. Verified and ready to use.",
      features: ["Age verification", "Real activity history", "Multiple countries available"],
      category: "Profiles"
    },
    {
      icon: <ShieldCheck className="w-12 h-12" />,
      title: "Business Manager",
      description: "Verified Facebook Business Managers for secure ad campaign management.",
      features: ["Verified accounts", "Ad account included", "Full access rights"],
      category: "Business Tools"
    },
    {
      icon: <Instagram className="w-12 h-12" />,
      title: "Facebook Pages",
      description: "Established Facebook pages with followers. Ideal for brand building and marketing.",
      features: ["Active followers", "Engagement history", "Niche-specific options"],
      category: "Pages"
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Instagram Assets",
      description: "High-quality Instagram accounts and assets to boost your social media presence.",
      features: ["Verified accounts", "Follower base", "Content history"],
      category: "Instagram"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Ad Accounts",
      description: "Pre-warmed Facebook ad accounts ready for your marketing campaigns.",
      features: ["Spending history", "No restrictions", "Multiple payment methods"],
      category: "Advertising"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Custom Solutions",
      description: "Tailored social media solutions to meet your unique business requirements.",
      features: ["Personalized approach", "Bulk discounts", "24/7 support"],
      category: "Custom"
    }
  ];

  const handleContactSupport = () => {
    window.open('https://t.me/chiphensir', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Our <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Services</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Premium Facebook assets and social media accounts ready for your marketing campaigns
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="bg-card/50 border-border/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="text-accent mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <Badge variant="outline" className="w-fit mx-auto mb-4 border-accent/20 text-accent">
                      {service.category}
                    </Badge>
                    <CardTitle className="text-2xl font-bold text-white mb-4">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-lg">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full cta-button">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Need Custom Services?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Contact our team for personalized social media solutions and bulk pricing options
            </p>
            <Button 
              className="cta-button text-lg px-8 py-4"
              onClick={handleContactSupport}
            >
              Contact Support
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
