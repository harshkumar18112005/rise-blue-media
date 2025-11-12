export type TicketStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed';

export interface Ticket {
  id: string;
  user_id: string;
  service_id: string | null;
  subject: string;
  description: string;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  status: TicketStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketInput {
  service_id?: string;
  subject: string;
  description: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  admin_response?: string;
}
