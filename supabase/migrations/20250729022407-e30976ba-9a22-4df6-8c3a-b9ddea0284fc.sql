-- Add updated_at column to services table
ALTER TABLE public.services 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add some sample services data
INSERT INTO public.services (title, description, icon_name, features) VALUES
('Facebook Ads Management', 'Professional Facebook advertising campaigns to boost your business reach and engagement.', 'Target', ARRAY['Campaign Setup', 'Audience Targeting', 'Performance Tracking', 'Monthly Reports']),
('Instagram Marketing', 'Complete Instagram marketing solutions including content creation and follower growth.', 'Instagram', ARRAY['Content Strategy', 'Hashtag Research', 'Story Creation', 'Engagement Boost']),
('Facebook Page Setup', 'Complete Facebook business page setup with optimization for maximum visibility.', 'Facebook', ARRAY['Page Creation', 'Profile Optimization', 'Cover Design', 'Initial Content']),
('Account Recovery', 'Professional Facebook and Instagram account recovery services for disabled accounts.', 'Shield', ARRAY['Account Analysis', 'Appeal Process', 'Documentation', 'Success Guarantee']),
('Content Creation', 'High-quality content creation for your social media platforms and marketing needs.', 'PenTool', ARRAY['Graphic Design', 'Video Editing', 'Copywriting', 'Brand Guidelines']),
('Analytics & Reporting', 'Comprehensive social media analytics and performance reporting services.', 'BarChart3', ARRAY['Performance Metrics', 'Competitor Analysis', 'Growth Insights', 'Monthly Reports']),
('Social Media Strategy', 'Complete social media strategy development tailored to your business goals.', 'Lightbulb', ARRAY['Strategy Planning', 'Content Calendar', 'Platform Optimization', 'Goal Setting']),
('Influencer Marketing', 'Connect with relevant influencers to expand your brand reach and credibility.', 'Users', ARRAY['Influencer Research', 'Campaign Management', 'Performance Tracking', 'ROI Analysis']);