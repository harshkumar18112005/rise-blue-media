-- Enable Row Level Security on the services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read services (public data)
CREATE POLICY "Anyone can view services" 
ON public.services 
FOR SELECT 
USING (true);

-- Create policy to allow only authenticated users to insert services (if needed for admin functionality)
CREATE POLICY "Authenticated users can insert services" 
ON public.services 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy to allow only authenticated users to update services (if needed for admin functionality)
CREATE POLICY "Authenticated users can update services" 
ON public.services 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow only authenticated users to delete services (if needed for admin functionality)
CREATE POLICY "Authenticated users can delete services" 
ON public.services 
FOR DELETE 
TO authenticated
USING (true);