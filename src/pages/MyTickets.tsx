import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ticketOperations } from '@/integrations/supabase/tickets';
import { Ticket, TicketStatus } from '@/types/ticket';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Ticket as TicketIcon, MessageSquare, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import TicketConversation from '@/components/TicketConversation';

const statusColors: Record<TicketStatus, string> = {
  pending: 'bg-yellow-500',
  accepted: 'bg-blue-500',
  rejected: 'bg-red-500',
  in_progress: 'bg-purple-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500',
};

const statusLabels: Record<TicketStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const MyTickets = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
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
      const data = await ticketOperations.getUserTickets();
      setTickets(data);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
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
            <TicketIcon className="w-4 h-4 mr-2" />
            Raise New Ticket
          </Button>
        </div>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <TicketIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
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
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{ticket.subject}</CardTitle>
                      <CardDescription>
                        {ticket.service_id && (
                          <span className="mr-4">Service: {ticket.service_id}</span>
                        )}
                        <span>Ticket ID: {ticket.id.slice(0, 8)}</span>
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[ticket.status]}>
                      {statusLabels[ticket.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details">
                      <AccordionTrigger>View Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                          </div>
                          
                          {ticket.attachments && ticket.attachments.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Paperclip className="w-4 h-4" />
                                Attachments ({ticket.attachments.length})
                              </h4>
                              <div className="space-y-2">
                                {ticket.attachments.map((attachment, idx) => (
                                  <a
                                    key={idx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    {attachment.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="discussion">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Discussion & Follow-ups
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <TicketConversation ticketId={ticket.id} isAdmin={false} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
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
