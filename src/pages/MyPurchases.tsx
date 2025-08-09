import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Search, Package, Calendar, DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MyPurchases = () => {
  const [email, setEmail] = useState('');
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Purchase search logic - integrate with backend when available
    // For now, we'll simulate a search with mock data
    setTimeout(() => {
      // Mock purchases data - replace with actual API call
      const mockPurchases = [
        {
          id: '1',
          productName: 'Premium Website Package',
          date: '2024-01-15',
          amount: '$2,999',
          status: 'Completed',
          quantity: 1
        },
        {
          id: '2',
          productName: 'SEO Optimization Service',
          date: '2024-01-20',
          amount: '$599',
          status: 'In Progress',
          quantity: 1
        }
      ];
      
      setPurchases(email.includes('@') ? mockPurchases : []);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold text-foreground">My Purchases</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Enter your email address to view your purchase history
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Find Your Purchases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter the email address you used when purchasing"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={!email.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Searching...' : 'Search Purchases'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {hasSearched && (
            <div>
              {purchases.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    Purchase History for {email}
                  </h2>
                  
                  {purchases.map((purchase: any) => (
                    <Card key={purchase.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <div className="flex items-center mb-2">
                              <Package className="h-5 w-5 text-primary mr-2" />
                              <h3 className="font-semibold text-lg">{purchase.productName}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {purchase.quantity}
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-1">
                              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm font-medium">Purchase Date</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{purchase.date}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm font-medium">Amount</span>
                            </div>
                            <p className="text-lg font-bold text-primary">{purchase.amount}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              purchase.status === 'Completed' 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'bg-accent/10 text-accent border border-accent/20'
                            }`}>
                              {purchase.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Purchases Found
                    </h3>
                    <p className="text-muted-foreground">
                      We couldn't find any purchases associated with this email address.
                    </p>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">
                      Make sure you're using the same email address you provided when making the purchase.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyPurchases;