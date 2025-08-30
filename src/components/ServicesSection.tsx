import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, TrendingUp, Zap, Globe, CheckCircle, Target, Instagram, Facebook, PenTool, BarChart3, Lightbulb, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

type Service = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features: string[];
};

const iconMap: Record<string, LucideIcon> = {
  Target,
  Instagram,
  Facebook,
  Shield,
  PenTool,
  BarChart3,
  Lightbulb,
  Users,
  TrendingUp,
  Zap,
  Globe,
  CheckCircle
};

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(6);

      if (error) {
        return;
      }

      setServices(data || []);
    } catch (error) {
      // Error handling without console logs
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Shield;
    return <IconComponent className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <section id="services" className="py-24 bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse text-white">Loading services...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Our <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We provide premium social media assets to help you scale your business and reach your marketing goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="bg-card/50 border-border/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group h-full flex flex-col">
              <CardHeader className="pb-2 p-3 md:p-6 md:pb-3">
                <div className="text-accent mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(service.icon_name)}
                </div>
                <CardTitle className="text-sm md:text-lg font-semibold text-white mb-1 md:mb-2 leading-tight">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-400 text-xs md:text-sm">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 p-3 md:p-6 md:pt-0 flex flex-col flex-grow">
                <ul className="space-y-1 md:space-y-1.5 mb-3 md:mb-4 flex-grow">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300 text-xs md:text-sm">
                      <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent mr-1.5 md:mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={`/services/${service.id}`} className="mt-auto">
                  <Button className="w-full cta-button text-xs md:text-sm py-1.5 md:py-2">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/services">
            <Button variant="prominent" size="lg" className="text-lg px-8 py-4">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;