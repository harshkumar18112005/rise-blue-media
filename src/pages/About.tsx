import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportWidget from '@/components/SupportWidget';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Shield className="w-12 h-12 text-accent" />,
      title: "Trust & Security",
      description: "Every asset is thoroughly verified and backed by our security guarantee."
    },
    {
      icon: <Users className="w-12 h-12 text-accent" />,
      title: "Customer Success",
      description: "Our dedicated support team ensures your success with 24/7 assistance."
    },
    {
      icon: <Award className="w-12 h-12 text-accent" />,
      title: "Premium Quality",
      description: "We provide only the highest quality, aged social media assets."
    },
    {
      icon: <Globe className="w-12 h-12 text-accent" />,
      title: "Global Reach",
      description: "Serving businesses worldwide with localized support and solutions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">About Rise Blue Media</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We're the leading provider of premium Facebook assets, helping businesses scale their marketing 
              efforts with verified profiles, business managers, and established pages.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-gray-300 mb-6">
                  At Rise Blue Media, we believe that every business deserves access to premium social media assets 
                  that can accelerate their growth and success. Our mission is to provide the most reliable, 
                  secure, and high-quality Facebook assets in the industry.
                </p>
                <p className="text-gray-300">
                  Since our founding, we've helped thousands of businesses establish their online presence, 
                  scale their advertising efforts, and achieve their marketing goals through our carefully 
                  curated collection of verified assets.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg p-8 border border-accent/20">
                  <h3 className="text-2xl font-semibold text-white mb-4">Why Choose Us?</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      100% verified and authentic assets
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Instant delivery and setup support
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      30-day money-back guarantee
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      24/7 customer support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                These principles guide everything we do and ensure we deliver exceptional value to our clients.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-card/20 border-border/20 hover:bg-card/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-300 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Commitment</h2>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              We're committed to maintaining the highest standards of quality and security in everything we do. 
              Our team of experts continuously monitors the market to ensure we're providing the most valuable 
              and reliable assets to help your business succeed.
            </p>
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-8 border border-accent/20">
              <h3 className="text-xl font-semibold text-white mb-4">Ready to Scale Your Business?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of satisfied customers who trust Rise Blue Media for their social media asset needs.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
};

export default About;