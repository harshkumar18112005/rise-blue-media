import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Ticket, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

type TicketWithResponses = {
  id: string;
  title: string;
  description: string;
  service_name: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'solved';
  created_at: string;
  updated_at: string;
  ticket_responses: Array<{
    message: string;
    created_at: string;
  }>;
};

const statusColors = {
  pending: 'bg-yellow-500',
  accepted: 'bg-blue-500',
  rejected: 'bg-red-500',
  in_progress: 'bg-purple-500',
  solved: 'bg-green-500',
};

const MyTickets = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<TicketWithResponses[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchTickets();
    }
  }, [user, authLoading, navigate]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets' as any)
        .select(`
          *,
          ticket_responses(message, created_at)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data as any || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
            <p className="text-muted-foreground">View and track your support tickets</p>
          </div>
          <Button onClick={() => navigate('/raise-ticket')}>
            <Ticket className="w-4 h-4 mr-2" />
            Raise New Ticket
          </Button>
        </div>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't raised any support tickets
              </p>
              <Button onClick={() => navigate('/raise-ticket')}>
                Raise Your First Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{ticket.title}</CardTitle>
                      <CardDescription>
                        {ticket.service_name && (
                          <span className="mr-4">Service: {ticket.service_name}</span>
                        )}
                        <span>Ticket ID: {ticket.id.slice(0, 8)}</span>
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[ticket.status]}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{ticket.description}</p>
                  
                  {ticket.ticket_responses && ticket.ticket_responses.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-semibold">Admin Responses:</span>
                      </div>
                      <div className="space-y-3">
                        {ticket.ticket_responses.map((response, idx) => (
                          <div key={idx} className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">{response.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(response.created_at), 'PPp')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-muted-foreground">
                    <span>Created: {format(new Date(ticket.created_at), 'PPp')}</span>
                    <span>Updated: {format(new Date(ticket.updated_at), 'PPp')}</span>
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

export default MyTickets;
