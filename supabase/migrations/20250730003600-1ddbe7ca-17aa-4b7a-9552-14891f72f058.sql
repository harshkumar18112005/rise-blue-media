-- Create products table with structure matching the sample products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  price VARCHAR NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  features TEXT[] NOT NULL DEFAULT '{}',
  image VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'In Stock',
  popular BOOLEAN DEFAULT false,
  premium BOOLEAN DEFAULT false,
  icon_name VARCHAR NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products (similar to services)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products data
INSERT INTO public.products (title, description, category, price, stock, features, image, status, popular, premium, icon_name) VALUES
('USA Advertising Access Reinstated Profile (ARI)', 'Premium reinstated Facebook profile with advertising access, ID card included, farmed account with friends.', 'Reinstate Accounts', '$35.00', 0, ARRAY['Advertising access', 'ID card included', 'Farmed with friends', 'USA profile'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/ee6d58f3-d104-4893-e2b4-afb2ce321a00/public', 'Out of Stock', false, false, 'Shield'),
('USA Double Reinstated Account (SARI)', 'USA advertising access double reinstated account with ID card, farmed account with posts.', 'Double Reinstated Accounts', '$40.00', 0, ARRAY['Double reinstated', 'ID card included', 'Farmed with posts', 'USA profile'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/88b4381e-7abb-41d3-5a1f-a7485b06f200/public', 'Out of Stock', false, false, 'Shield'),
('USA Super Aged Reinstated Profile', 'Premium aged reinstated profile with ID card - super aged and premium quality account.', 'Super Aged Reinstated', '$120.00', 33, ARRAY['Super aged profile', 'Premium quality', 'ID card included', 'High success rate'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/88b4381e-7abb-41d3-5a1f-a7485b06f200/public', 'In Stock', true, false, 'Star'),
('Facebook Reinstated Fan Pages (ARI)', 'Facebook advertising access reinstated fan pages with name & niche changeable options.', 'Facebook Fan Pages', '$40.00', 2, ARRAY['Name changeable', 'Niche changeable', 'Advertising access', 'Reinstated status'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/0954c130-59fd-41d8-e19e-47eacb74c600/public', 'In Stock', false, false, 'Users'),
('Facebook Aged Fan Pages (2010-2022)', 'Facebook aged fan pages created between 2010-2022 with name & niche changeable.', 'Facebook Fan Pages', '$40.00', 4, ARRAY['Created 2010-2022', 'Name changeable', 'Niche changeable', 'Aged account'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/0954c130-59fd-41d8-e19e-47eacb74c600/public', 'In Stock', false, false, 'Users'),
('Super Strong Facebook Fan Pages (5K-10K)', 'Super strong Facebook fan pages with 5K-10K followers, name & niche changeable.', 'Facebook Fan Pages', '$200.00', 19, ARRAY['5K-10K followers', 'Super strong', 'Name changeable', 'High engagement'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/0954c130-59fd-41d8-e19e-47eacb74c600/public', 'In Stock', true, false, 'TrendingUp'),
('Super Strong Facebook Fan Pages (10K-30K)', 'Super strong Facebook fan pages with 10K-30K followers, name & niche changeable.', 'Facebook Fan Pages', '$250.00', 17, ARRAY['10K-30K followers', 'Super strong', 'Name changeable', 'Premium engagement'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/0954c130-59fd-41d8-e19e-47eacb74c600/public', 'In Stock', true, false, 'TrendingUp'),
('Facebook Blue Tick Fan Page', 'Facebook verified blue tick fan page - one of the best pages for advertising campaigns.', 'Facebook Fan Pages', '$1500.00', 10, ARRAY['Blue tick verified', 'Premium for ads', 'High trust factor', 'Rare availability'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/0954c130-59fd-41d8-e19e-47eacb74c600/public', 'In Stock', false, true, 'CheckCircle'),
('Facebook Verified Business Manager (USA)', 'Facebook verified business manager with ID card verification from USA.', 'Verified Business Managers', '$70.00', 12, ARRAY['ID verified', 'USA country', 'Clean history', 'Ready to use'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/d8733495-d68d-4d35-e331-fa16a16f1000/public', 'In Stock', false, false, 'Shield'),
('Verified + Reinstated Business Manager', 'Facebook verified and reinstated business manager with ID card from USA.', 'Verified Business Managers', '$80.00', 11, ARRAY['Verified + Reinstated', 'ID card included', 'USA country', 'Double protection'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/d8733495-d68d-4d35-e331-fa16a16f1000/public', 'In Stock', false, false, 'Shield'),
('Aged Verified BM (2018-2022)', 'Aged verified business manager created 2018-2022 with real company docs and fast limit increase.', 'Verified Business Managers', '$250.00', 46, ARRAY['Aged 2018-2022', 'Real company docs', 'Fast limit increase', 'Premium quality'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/d8733495-d68d-4d35-e331-fa16a16f1000/public', 'In Stock', true, false, 'Star'),
('250$ Daily Spending Limit Personal Ads', 'Personal ads account with 250$ daily spending limit, country/currency/timezone changeable.', 'High Limit Personal Ads', '$99.00', 26, ARRAY['250$ daily limit', 'Country changeable', 'Currency changeable', 'Timezone flexible'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/8a07dae2-51b2-4894-a2e1-5df73c162d00/public', 'In Stock', true, false, 'DollarSign'),
('1500$ Daily Spending Limit Personal Ads', 'High limit personal ads account with 1500$ daily spending capacity.', 'High Limit Personal Ads', '$200.00', 41, ARRAY['1500$ daily limit', 'High spending capacity', 'Personal account', 'Premium limits'], 'https://imagedelivery.net/Pht1ckgmpKl0YOB2QHSQ8Q/8a07dae2-51b2-4894-a2e1-5df73c162d00/public', 'In Stock', false, false, 'DollarSign'),
('Best Quality Hotmail Email Accounts', 'High quality Hotmail email accounts for any purpose - 100% secured and verified.', 'Emails', '$0.50', 255, ARRAY['100% secured', 'Any purpose use', 'High quality', 'Bulk available'], 'https://res.cloudinary.com/dohfu9dzt/image/upload/v1679156938/Untitled_design_4_xiycw4.png', 'In Stock', false, false, 'Package');