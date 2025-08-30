import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Shield, 
  Globe, 
  TrendingUp, 
  CheckCircle, 
  Users, 
  Zap, 
  Search,
  Eye,
  Lock,
  AlertTriangle,
  Store,
  BarChart3,
  Target,
  Instagram,
  Facebook,
  PenTool,
  Lightbulb,
  LucideIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type Service = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features: string[];
  created_at: string;
  updated_at: string;
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
  CheckCircle,
  Eye,
  Lock,
  AlertTriangle,
  Store
};

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
        .order('updated_at', { ascending: false });

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

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Our <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Services</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Comprehensive Facebook marketing solutions and premium social media assets to scale your business
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card/50 border-border/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-pulse text-white">Loading services...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="bg-card/50 border-border/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group relative">
                    <CardHeader className="pb-3">
                      <div className="text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                        {getIcon(service.icon_name)}
                      </div>
                      <CardTitle className="text-lg font-semibold text-white mb-2 leading-tight">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-sm line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <ul className="space-y-1.5 mb-4">
                        {service.features.slice(0, 3).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-accent mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Link to={`/services/${service.id}`}>
                        <Button className="w-full cta-button text-sm py-2">
                          Learn More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No services found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Need Custom Solutions?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Contact our team for tailored Facebook marketing solutions and bulk pricing options
            </p>
            <Button className="cta-button text-lg px-8 py-4">
              <a href='https://t.me/chiphensir'>Contact Support</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;