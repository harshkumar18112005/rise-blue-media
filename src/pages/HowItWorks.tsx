import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportWidget from '@/components/SupportWidget';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Lock, Shield, Zap, CheckCircle, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Search className="w-12 h-12" />,
      title: "Browse Verified Assets",
      description: "Explore our curated selection of premium Facebook profiles, business managers, and pages.",
      number: "01"
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: "Secure Purchase",
      description: "Complete your purchase through our encrypted payment system with full buyer protection.",
      number: "02"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Instant Verification",
      description: "Receive your verified assets immediately with complete documentation and support.",
      number: "03"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Scale Your Business",
      description: "Start leveraging your new assets to grow your advertising reach and business success.",
      number: "04"
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle className="w-8 h-8 text-accent" />,
      title: "100% Verified Assets",
      description: "Every asset goes through rigorous verification to ensure authenticity and compliance."
    },
    {
      icon: <Clock className="w-8 h-8 text-accent" />,
      title: "Instant Delivery",
      description: "Get your assets immediately after purchase with complete setup instructions."
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: "24/7 Support",
      description: "Our expert team is available around the clock to assist with any questions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">How It Works</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Getting premium Facebook assets has never been easier. Follow our simple 4-step process 
              to scale your business with verified social media assets.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="bg-card/20 border-border/20 hover:bg-card/30 transition-all duration-300">
                  <CardContent className="p-8 text-center relative">
                    <div className="absolute top-4 right-4 text-accent font-bold text-lg opacity-50">
                      {step.number}
                    </div>
                    <div className="flex justify-center mb-6 text-accent">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our Process?</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our streamlined process ensures you get the highest quality assets with complete peace of mind.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Detail Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-8 border border-accent/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">What Happens After Purchase?</h2>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3"></div>
                      <span>Immediate access to your purchased assets</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3"></div>
                      <span>Complete setup guide and documentation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3"></div>
                      <span>Access to our private support community</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3"></div>
                      <span>30-day warranty and replacement guarantee</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-300 mb-6">
                    Browse our premium collection of verified Facebook assets and start scaling your business today.
                  </p>
                  <Button 
                    className="cta-button text-lg px-8 py-3"
                    onClick={() => navigate('/products')}
                  >
                    Browse Products
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
};

export default HowItWorks;