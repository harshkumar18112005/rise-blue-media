
export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features: string[];
  documentation?: string;
  created_at?: string;
  updated_at?: string;
}
