export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  is_admin: boolean;
  created_at: string;
}

export interface CreateTicketMessageInput {
  ticket_id: string;
  message: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  is_admin?: boolean;
}
