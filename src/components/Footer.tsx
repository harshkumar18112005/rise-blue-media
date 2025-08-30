import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-card/20 border-t border-border/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img src="https://iili.io/FGwvLb9.md.png" alt="Rise Blue Media Logo" className="h-8 mr-3" />
              <span className="text-lg font-bold text-white">Rise Blue Media</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for premium Social Media assets. We help businesses scale their marketing efforts with verified profiles, business managers, and established pages.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-accent hover:bg-accent/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-accent hover:bg-accent/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-accent hover:bg-accent/10">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-accent transition-colors duration-300">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-accent transition-colors duration-300">Products</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-accent transition-colors duration-300">Services</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-accent transition-colors duration-300">How it Works</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-accent transition-colors duration-300">About</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services/29421484-4d92-44b7-85f2-411f37289293" className="text-gray-400 hover:text-accent transition-colors duration-300">BM Verifications</Link></li>
              <li><Link to="/services/52760ed1-002f-4152-b133-c73241964f49" className="text-gray-400 hover:text-accent transition-colors duration-300">Google Ads Account SPY</Link></li>
              <li><Link to="/services/d70efb82-5787-4213-96a1-65cfe5ec8966" className="text-gray-400 hover:text-accent transition-colors duration-300">BM SPY Service</Link></li>
              <li><Link to="/services/6fe2146c-f00a-4efd-bf48-1646a880d7a3" className="text-gray-400 hover:text-accent transition-colors duration-300">Shopify Spy Service</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-accent transition-colors duration-300">Custom Solutions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3 text-accent" />
                <span>grivperm@gmail.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-3 text-accent" />
                <span>+91 9211752622</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-3 text-accent" />
                <span>Global Support Available</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Newsletter</h4>
              <div className="flex">
                <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 bg-background border border-border rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent" />
                <Button className="cta-button rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Rise Blue Media. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-accent text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-accent text-sm transition-colors duration-300">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-gray-400 hover:text-accent text-sm transition-colors duration-300">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;