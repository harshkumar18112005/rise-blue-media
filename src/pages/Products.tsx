
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Search,
  Eye,
  Lock,
  Star,
  DollarSign,
  Package
} from 'lucide-react';

// Icon mapping
const iconMap = {
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  DollarSign,
  Package,
  Eye,
  Lock
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          return;
        }

        setProducts(data || []);
      } catch (error) {
        // Error handling without console logs
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(product => product.category))];

  let filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply in-stock filter
  if (showInStockOnly) {
    filteredProducts = filteredProducts.filter(product => product.stock > 0);
  }

  // Apply sorting
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
  }

  const handleContactSupport = () => {
    window.open('https://t.me/chiphensir', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <p className="text-gray-400 text-lg">Loading products...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Our <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Products</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Premium Facebook assets and social media accounts ready for your marketing campaigns
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card/50 border-border/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="in-stock-only"
                    checked={showInStockOnly}
                    onCheckedChange={setShowInStockOnly}
                  />
                  <Label htmlFor="in-stock-only" className="text-gray-300">
                    Show in stock only
                  </Label>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-card/50 border-border/20 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Recently Updated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant="outline" 
                  className="border-accent/20 text-accent bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const IconComponent = iconMap[product.icon_name as keyof typeof iconMap] || Package;
                
                return (
                  <Card key={product.id} className="bg-card/50 border-border/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 group relative">
                    
                    <CardHeader className="pb-2 p-3 md:p-6 md:pb-3">
                      <div className="relative h-24 md:h-32 mb-2 md:mb-3 rounded-lg overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <Badge variant="outline" className="w-fit text-xs mb-1 md:mb-2 border-accent/20 text-accent">
                        {product.category}
                      </Badge>
                      <CardTitle className="text-sm md:text-lg font-semibold text-white mb-1 md:mb-2 leading-tight truncate">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-xs md:text-sm line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
                      <ul className="space-y-1 md:space-y-1.5 mb-3 md:mb-4">
                        {product.features.slice(0, 3).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-300 text-xs md:text-sm">
                            <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent mr-1.5 md:mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <span className="text-accent font-semibold text-sm md:text-lg">
                          {product.price}
                        </span>
                        <Badge 
                          variant={product.stock > 0 ? "default" : "destructive"}
                          className={`text-xs ${product.stock > 0 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                        >
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <span className="text-gray-400 text-xs md:text-sm">
                          Stock: {product.stock} pcs
                        </span>
                        <div className="flex items-center gap-1 text-gray-400">
                          <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </div>
                      </div>
                      
                      <Button 
                        className={`w-full text-xs md:text-sm py-1.5 md:py-2 ${product.stock > 0 ? "cta-button" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
                        disabled={product.stock === 0}
                      >
                        {product.stock > 0 ? "Buy Now" : "Out of Stock"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No products found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Need Custom Products?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Contact our team for custom Facebook assets and bulk pricing options
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

export default Products;
