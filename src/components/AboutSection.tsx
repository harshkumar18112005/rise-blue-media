import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Clock, Shield } from 'lucide-react';

const AboutSection = () => {
  const stats = [
    {
      icon: <Award className="w-8 h-8" />,
      number: "5+",
      label: "Years Experience",
      description: "Trusted expertise in social media assets"
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "1000+",
      label: "Happy Clients",
      description: "Businesses trust us worldwide"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: "24/7",
      label: "Support",
      description: "Always here when you need us"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      number: "100%",
      label: "Secure",
      description: "All transactions are protected"
    }
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              About <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Rise Blue Media</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              We are a leading provider of premium Facebook assets, specializing in verified profiles, business manager accounts, and established pages. Our mission is to help businesses scale their marketing efforts with authentic, high-quality social media assets.
            </p>
            
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              With years of experience in the industry, we understand the challenges businesses face when trying to establish credibility on social media platforms. That's why we provide only the highest quality, fully verified assets that meet platform requirements and help you achieve your marketing goals.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-accent rounded-full mr-4"></div>
                <span>Premium verified Facebook profiles and business accounts</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-accent rounded-full mr-4"></div>
                <span>Established pages with real engagement and followers</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-accent rounded-full mr-4"></div>
                <span>24/7 customer support and secure transaction processing</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-accent rounded-full mr-4"></div>
                <span>Custom solutions for enterprise and agency clients</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="cta-button">
                Contact Us
              </Button>
              <Button className="outline-button">
                Our Story
              </Button>
            </div>
          </div>
          
          {/* Right Side - Stats */}
          <div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-card/30 border-border/20 backdrop-blur-sm hover:bg-card/50 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="text-accent mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-accent mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-400">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Trust Badges */}
            <div className="mt-8 p-6 bg-card/20 border border-border/20 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Why Choose Us?
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Money Back Guarantee</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;