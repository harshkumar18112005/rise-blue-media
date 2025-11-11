import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type TicketType = {
  id: string;
  title: string;
  description: string;
  service_name: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'solved';
  created_at: string;
  user_id: string;
};

const AdminTickets = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      checkAdminAndFetchTickets();
    }
  }, [user, authLoading, navigate]);

  const checkAdminAndFetchTickets = async () => {
    try {
      const { data: roleData } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single();

      if (!roleData) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchTickets();
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data as any || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    setUpdatingTicket(ticketId);
    try {
      const { error } = await supabase
        .from('tickets' as any)
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Ticket status updated');
      fetchTickets();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update ticket');
    } finally {
      setUpdatingTicket(null);
    }
  };

  const sendResponse = async (ticketId: string) => {
    const message = responses[ticketId];
    if (!message || !message.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    setUpdatingTicket(ticketId);
    try {
      const { error } = await supabase
        .from('ticket_responses' as any)
        .insert({
          ticket_id: ticketId,
          admin_id: user?.id,
          message: message.trim(),
        } as any);

      if (error) throw error;

      toast.success('Response sent successfully');
      setResponses({ ...responses, [ticketId]: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send response');
    } finally {
      setUpdatingTicket(null);
    }
  };

  if (authLoading || loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin - Ticket Management</h1>
          <p className="text-muted-foreground">Manage and respond to user tickets</p>
        </div>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No tickets to display</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{ticket.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.service_name && `Service: ${ticket.service_name} • `}
                        Ticket ID: {ticket.id.slice(0, 8)}
                      </p>
                    </div>
                    <Badge>{ticket.status.replace('_', ' ').toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{ticket.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Created: {format(new Date(ticket.created_at), 'PPp')}</span>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTicketStatus(ticket.id, 'accepted')}
                        disabled={updatingTicket === ticket.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTicketStatus(ticket.id, 'rejected')}
                        disabled={updatingTicket === ticket.id}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                        disabled={updatingTicket === ticket.id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="solved">Solved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your response to the user..."
                        value={responses[ticket.id] || ''}
                        onChange={(e) => setResponses({ ...responses, [ticket.id]: e.target.value })}
                        rows={3}
                      />
                      <Button
                        onClick={() => sendResponse(ticket.id)}
                        disabled={updatingTicket === ticket.id}
                        size="sm"
                      >
                        {updatingTicket === ticket.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <MessageSquare className="w-4 h-4 mr-2" />
                        )}
                        Send Response
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminTickets;
