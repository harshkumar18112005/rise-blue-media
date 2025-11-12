import { supabase } from './client';
import { CreateTicketInput, UpdateTicketInput, Ticket } from '@/types/ticket';
import { CreateTicketMessageInput, TicketMessage } from '@/types/ticketMessage';

export const ticketOperations = {
  // Create a new ticket
  async createTicket(ticketData: CreateTicketInput): Promise<Ticket> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a ticket');
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        user_id: user.id,
        service_id: ticketData.service_id || null,
        subject: ticketData.subject,
        description: ticketData.description,
        attachments: ticketData.attachments || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  // Get all tickets for the current user
  async getUserTickets(): Promise<Ticket[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to view tickets');
    }

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Ticket[];
  },

  // Get a single ticket by ID
  async getTicketById(ticketId: string): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  // Get all tickets (admin only)
  // NOTE: This function is protected by Row Level Security (RLS) at the database level.
  // Only users with admin role in the user_roles table can access all tickets.
  // Non-admin users will only see their own tickets due to RLS policies.
  async getAllTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Ticket[];
  },

  // Get all tickets with user information (admin only)
  // Returns tickets with the user's email who created them
  async getAllTicketsWithUser(): Promise<any[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        user:user_id (
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as any[];
  },

  // Update ticket (admin)
  // NOTE: This function is protected by Row Level Security (RLS) at the database level.
  // Only users with admin role in the user_roles table can update any ticket.
  // Regular users can only update limited fields of their own tickets (not status or admin_response).
  async updateTicket(ticketId: string, updates: UpdateTicketInput): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;
    return data as Ticket;
  },

  // Upload attachment to storage
  async uploadAttachment(file: File): Promise<{ name: string; url: string; size: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('ticket-attachments')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('ticket-attachments')
      .getPublicUrl(fileName);

    return {
      name: file.name,
      url: publicUrl,
      size: file.size,
    };
  },

  // Delete a ticket (soft delete by updating status to 'closed')
  // NOTE: This function is protected by Row Level Security (RLS) at the database level.
  // The UPDATE operation will only succeed for:
  // 1. Admins (via "Admins can update all tickets" policy), OR
  // 2. Regular users trying to update their own ticket, BUT they are blocked from changing
  //    the status field by the "Users can update own tickets limited fields" policy.
  // Therefore, effectively only admins can successfully "delete" (close) tickets.
  async deleteTicket(ticketId: string): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'closed' })
      .eq('id', ticketId);

    if (error) throw error;
  },

  // =====================================================
  // DISCUSSION / CONVERSATION FEATURES
  // =====================================================

  // Get all messages for a ticket
  async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as TicketMessage[];
  },

  // Create a new message in a ticket
  async createTicketMessage(messageData: CreateTicketMessageInput): Promise<TicketMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to post messages');
    }

    const { data, error } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: messageData.ticket_id,
        user_id: user.id,
        message: messageData.message,
        attachments: messageData.attachments || [],
        is_admin: messageData.is_admin || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as TicketMessage;
  },

  // Delete a message (admin only)
  async deleteTicketMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('ticket_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  },
};
