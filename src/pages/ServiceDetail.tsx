import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ArrowLeft,
  Star,
  Clock,
  Shield as ShieldCheck
} from 'lucide-react';

const ServiceDetail = () => {
  const { serviceId } = useParams();

  const serviceDetails = {
    'bm-spy': {
      icon: <Eye className="w-8 h-8" />,
      title: "Facebook BM SPY Service",
      description: "Professional competitor intelligence service to spy on Facebook Business Manager ad accounts and gain strategic advantages.",
      category: "Spy Services",
      price: "Contact for pricing",
      rating: 4.9,
      deliveryTime: "24-48 hours",
      features: [
        "Complete competitor ad account analysis",
        "Detailed campaign performance insights",
        "Ad creative and copy analysis",
        "Audience targeting strategies",
        "Budget and bidding information",
        "Professional detailed reports",
        "Ongoing monitoring options",
        "Expert consultation included"
      ],
      benefits: [
        "Gain competitive advantage in your market",
        "Discover successful ad strategies",
        "Optimize your own campaigns based on competitor data",
        "Save time on market research",
        "Professional expert analysis"
      ],
      process: [
        "Provide competitor Business Manager details",
        "Our experts analyze the account thoroughly",
        "Comprehensive report generation",
        "Detailed consultation call",
        "Ongoing support and updates"
      ]
    },
    'google-spy': {
      icon: <Search className="w-8 h-8" />,
      title: "Google Ads Account SPY Service",
      description: "Advanced Google Ads competitor intelligence service for comprehensive market analysis and strategic insights.",
      category: "Spy Services",
      price: "Contact for pricing",
      rating: 4.8,
      deliveryTime: "24-48 hours",
      features: [
        "Complete Google Ads account analysis",
        "Keyword strategy insights",
        "Ad copy and creative analysis",
        "Landing page examination",
        "Budget and bidding strategies",
        "Performance metrics analysis",
        "Competitor tracking setup",
        "Strategic recommendations"
      ],
      benefits: [
        "Discover profitable keywords",
        "Analyze competitor ad strategies",
        "Optimize your Google Ads performance",
        "Reduce market research time",
        "Professional strategic guidance"
      ],
      process: [
        "Submit competitor Google Ads details",
        "Professional account analysis",
        "Comprehensive report creation",
        "Strategy consultation",
        "Implementation guidance"
      ]
    },
    'shopify-spy': {
      icon: <Store className="w-8 h-8" />,
      title: "Shopify Spy Service",
      description: "Complete e-commerce intelligence service for Shopify stores, providing deep insights into competitor strategies.",
      category: "Spy Services",
      price: "Contact for pricing",
      rating: 4.7,
      deliveryTime: "48-72 hours",
      features: [
        "Store performance analysis",
        "Product research and insights",
        "Sales volume estimation",
        "Marketing strategy analysis",
        "App and integration review",
        "Design and UX analysis",
        "SEO and traffic insights",
        "Pricing strategy review"
      ],
      benefits: [
        "Identify winning products",
        "Understand market trends",
        "Optimize store performance",
        "Competitive pricing insights",
        "Marketing strategy optimization"
      ],
      process: [
        "Provide target Shopify store URL",
        "Comprehensive store analysis",
        "Market research and data collection",
        "Detailed report generation",
        "Strategic consultation"
      ]
    },
    'checkpoint-unlock': {
      icon: <Lock className="w-8 h-8" />,
      title: "Facebook Checkpoint Video Verification Unlock",
      description: "Professional Facebook checkpoint unlock service specializing in video verification challenges and account recovery.",
      category: "Account Recovery",
      price: "Contact for pricing",
      rating: 4.9,
      deliveryTime: "24-72 hours",
      features: [
        "Video verification bypass",
        "Professional account recovery",
        "Checkpoint resolution expertise",
        "Multiple verification methods",
        "Fast turnaround time",
        "High success rate",
        "Expert support team",
        "Guaranteed results"
      ],
      benefits: [
        "Recover restricted accounts quickly",
        "Avoid account loss",
        "Professional handling",
        "Secure process",
        "Expert guidance"
      ],
      process: [
        "Account assessment and verification",
        "Professional unlock process",
        "Video verification handling",
        "Account restoration",
        "Security recommendations"
      ]
    },
    'ad-account-unban': {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Facebook Ad Account Unban Service",
      description: "Professional Facebook ad account restoration service with high success rates for policy violations and restrictions.",
      category: "Account Recovery",
      price: "Contact for pricing",
      rating: 4.8,
      deliveryTime: "3-7 days",
      features: [
        "Policy violation resolution",
        "Account restoration expertise",
        "Appeals process management",
        "Compliance optimization",
        "Quick turnaround",
        "High success rate",
        "Ongoing support",
        "Prevention strategies"
      ],
      benefits: [
        "Restore advertising capabilities",
        "Avoid revenue loss",
        "Professional appeals",
        "Policy compliance guidance",
        "Future protection"
      ],
      process: [
        "Account analysis and review",
        "Appeal strategy development",
        "Professional submission",
        "Follow-up and monitoring",
        "Account optimization"
      ]
    },
    'business-manager-verified': {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Business Manager Accounts",
      description: "Premium verified Facebook Business Manager accounts with high limits and clean history for professional advertising.",
      category: "Business Accounts",
      price: "$70 - $350",
      rating: 4.9,
      deliveryTime: "Instant delivery",
      features: [
        "ID verified accounts",
        "High spending limits",
        "Multiple ad accounts included",
        "Clean account history",
        "Various countries available",
        "Instant delivery",
        "Replacement guarantee",
        "24/7 support"
      ],
      benefits: [
        "Start advertising immediately",
        "High trust score",
        "Stable performance",
        "Professional credibility",
        "Reduced restrictions"
      ],
      process: [
        "Select account specifications",
        "Complete payment",
        "Instant account delivery",
        "Setup guidance",
        "Ongoing support"
      ]
    },
    'high-limit-personal': {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "High Limit Personal Ad Accounts",
      description: "Personal Facebook advertising accounts with high daily spending limits and proven performance track record.",
      category: "Ad Accounts",
      price: "$99 - $200",
      rating: 4.7,
      deliveryTime: "Instant delivery",
      features: [
        "High daily spending limits",
        "Country/currency changeable",
        "Timezone flexibility",
        "Strong performance history",
        "Clean account record",
        "Aged accounts available",
        "Multiple limit options",
        "Reliable delivery"
      ],
      benefits: [
        "Scale campaigns quickly",
        "Geographic flexibility",
        "Established trust",
        "Reduced learning phase",
        "Stable performance"
      ],
      process: [
        "Choose account specifications",
        "Complete secure payment",
        "Receive account details",
        "Account setup assistance",
        "Performance optimization"
      ]
    },
    'facebook-pages': {
      icon: <Users className="w-8 h-8" />,
      title: "Facebook Fan Pages",
      description: "Established Facebook pages with real followers, engagement history, and niche-specific content for your business.",
      category: "Social Assets",
      price: "$40 - $1500",
      rating: 4.6,
      deliveryTime: "Instant delivery",
      features: [
        "Real follower base",
        "Engagement history",
        "Niche-specific content",
        "Brand-ready pages",
        "Various follower counts",
        "Aged pages available",
        "Clean page history",
        "Transfer support"
      ],
      benefits: [
        "Instant social proof",
        "Established audience",
        "Better ad performance",
        "Brand credibility",
        "Time savings"
      ],
      process: [
        "Select page specifications",
        "Choose follower count",
        "Complete purchase",
        "Page transfer process",
        "Setup assistance"
      ]
    },
    'reinstate-accounts': {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Reinstated Facebook Accounts",
      description: "Premium reinstated Facebook profiles with advertising access, clean history, and verified credentials.",
      category: "Reinstated Assets",
      price: "$35 - $120",
      rating: 4.8,
      deliveryTime: "Instant delivery",
      features: [
        "Advertising access restored",
        "Clean account history",
        "ID verification included",
        "Farmed account activity",
        "Friends and posts included",
        "Multiple age options",
        "Country-specific",
        "Replacement warranty"
      ],
      benefits: [
        "Immediate ad capabilities",
        "Trusted account status",
        "Reduced restrictions",
        "Established presence",
        "Professional credibility"
      ],
      process: [
        "Select account type",
        "Choose specifications",
        "Secure payment",
        "Account delivery",
        "Setup guidance"
      ]
    },
    'custom-solutions': {
      icon: <Zap className="w-8 h-8" />,
      title: "Custom Facebook Solutions",
      description: "Tailored Facebook marketing and account management solutions designed for enterprise clients and specific requirements.",
      category: "Custom Services",
      price: "Custom pricing",
      rating: 5.0,
      deliveryTime: "Project-based",
      features: [
        "Custom requirement analysis",
        "Bulk discount pricing",
        "Priority support access",
        "Dedicated account manager",
        "Flexible delivery timeline",
        "Enterprise-grade solutions",
        "Ongoing consultation",
        "Performance guarantees"
      ],
      benefits: [
        "Tailored to your needs",
        "Cost-effective scaling",
        "Expert guidance",
        "Priority handling",
        "Long-term partnership"
      ],
      process: [
        "Requirement consultation",
        "Custom solution design",
        "Proposal and pricing",
        "Implementation planning",
        "Ongoing support"
      ]
    }
  };

  const service = serviceDetails[serviceId as keyof typeof serviceDetails];

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button className="cta-button">
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Back Navigation */}
        <div className="container mx-auto px-6 py-6">
          <Link to="/services" className="inline-flex items-center text-accent hover:text-accent/80 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
        </div>

        {/* Service Hero */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="border-accent/20 text-accent mb-4">
                  {service.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  {service.title}
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  {service.description}
                </p>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-white font-semibold">{service.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-accent mr-2" />
                    <span className="text-gray-300">{service.deliveryTime}</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-gray-300">Guaranteed Results</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="cta-button text-lg px-8 py-4">
                    Get Started Now
                  </Button>
                  <Button variant="outline" className="outline-button text-lg px-8 py-4">
                    Contact Support
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Card className="bg-card/50 border-border/20 backdrop-blur-sm p-8 max-w-sm w-full">
                  <div className="text-center">
                    <div className="text-accent mb-6 flex justify-center">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {service.price}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Professional service with guaranteed results
                    </p>
                    <Button className="w-full cta-button">
                      Order Now
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Features */}
              <Card className="bg-card/50 border-border/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <CheckCircle className="w-4 h-4 text-accent mr-3 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="bg-card/50 border-border/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <Star className="w-4 h-4 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Process */}
              <Card className="bg-card/50 border-border/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {service.process.map((step, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust our professional services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="cta-button text-lg px-8 py-4">
                Order {service.title}
              </Button>
              <Button variant="outline" className="outline-button text-lg px-8 py-4">
                Ask Questions
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;