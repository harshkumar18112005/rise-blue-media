
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Target, Instagram, Facebook, Shield, PenTool, BarChart3, Lightbulb, Users, TrendingUp, Zap, Globe, LucideIcon } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useErrorHandler } from '@/hooks/useErrorHandler';

type Service = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features: string[];
  documentation: string;
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

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      if (!serviceId) throw new Error('Service ID is required');
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      return data as Service;
    },
    enabled: !!serviceId,
  });

  if (error) {
    handleError(error);
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Shield;
    return <IconComponent className="w-8 h-8" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-gray-300 mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/services')} className="cta-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-6 py-24">
        <Button 
          onClick={() => navigate('/services')} 
          variant="ghost" 
          className="mb-8 text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 border-border/20 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-start gap-4">
                <div className="text-accent">
                  {getIcon(service.icon_name)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold text-white mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-300">
                    {service.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                <div className="grid gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {service.documentation && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Documentation</h3>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {service.documentation}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-border/20 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/services')}
                >
                  Explore More Services
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1 cta-button"
                  onClick={() => navigate(`/raise-ticket?service=${encodeURIComponent(service.title)}`)}
                >
                  Raise a Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
