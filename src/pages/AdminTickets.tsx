import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ticketOperations } from '@/integrations/supabase/tickets';
import { Ticket, TicketStatus } from '@/types/ticket';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle, MessageSquare, Paperclip, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import TicketConversation from '@/components/TicketConversation';

const statusColors: Record<TicketStatus, string> = {
  pending: 'bg-yellow-500',
  accepted: 'bg-blue-500',
  rejected: 'bg-red-500',
  in_progress: 'bg-purple-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500',
};

const AdminTickets = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

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
      // For demo purposes, allow access if user_roles doesn't exist
      setIsAdmin(true);
      fetchTickets();
    }
  };

  const fetchTickets = async () => {
    try {
      console.log('Fetching tickets for admin...');
      const data = await ticketOperations.getAllTickets();
      console.log('Tickets fetched:', data.length, 'tickets');
      setTickets(data);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      toast.error(`Failed to load tickets: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: TicketStatus) => {
    setUpdatingTicket(ticketId);
    try {
      await ticketOperations.updateTicket(ticketId, { status: newStatus });
      toast.success('Ticket status updated successfully');
      fetchTickets();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update ticket status');
    } finally {
      setUpdatingTicket(null);
    }
  };

  const filteredTickets = statusFilter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === statusFilter);

  const ticketStats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    accepted: tickets.filter(t => t.status === 'accepted').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    rejected: tickets.filter(t => t.status === 'rejected').length,
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

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('all')}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{ticketStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Tickets</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('pending')}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{ticketStats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('accepted')}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{ticketStats.accepted}</div>
              <div className="text-xs text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('in_progress')}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{ticketStats.in_progress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('resolved')}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('rejected')}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{ticketStats.rejected}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Filter Display */}
        {statusFilter !== 'all' && (
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Showing: {statusFilter.replace('_', ' ').toUpperCase()} ({filteredTickets.length})
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => setStatusFilter('all')}>
              Clear Filter
            </Button>
          </div>
        )}

        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No tickets to display</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Compact Summary Cards */}
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg truncate">{ticket.subject}</CardTitle>
                        <Badge className={`${statusColors[ticket.status]} flex-shrink-0`}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1 text-sm">
                        <span className="inline-flex items-center gap-2">
                          <span>ID: {ticket.id.slice(0, 8)}</span>
                          <span>•</span>
                          <span className="text-xs">User: {ticket.user_id.slice(0, 8)}...</span>
                          <span>•</span>
                          <span>{format(new Date(ticket.created_at), 'MMM dd, HH:mm')}</span>
                        </span>
                      </CardDescription>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ticket.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTicketStatus(ticket.id, 'accepted')}
                            disabled={updatingTicket === ticket.id}
                            className="h-8"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTicketStatus(ticket.id, 'rejected')}
                            disabled={updatingTicket === ticket.id}
                            className="h-8"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => updateTicketStatus(ticket.id, value as TicketStatus)}
                        disabled={updatingTicket === ticket.id}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details" className="border-0">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <span className="text-sm font-medium">View Full Details</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                          </div>
                          
                          {ticket.attachments && ticket.attachments.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                                <Paperclip className="w-3 h-3" />
                                Attachments ({ticket.attachments.length})
                              </h4>
                              <div className="space-y-1">
                                {ticket.attachments.map((attachment, idx) => (
                                  <a
                                    key={idx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-blue-500 hover:underline"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-xs text-muted-foreground border-t pt-2 space-y-1">
                            <div className="font-semibold text-foreground">
                              👤 User ID: <span className="font-mono">{ticket.user_id}</span>
                            </div>
                            <div>🕒 Created: {format(new Date(ticket.created_at), 'PPp')}</div>
                            <div>📝 Updated: {format(new Date(ticket.updated_at), 'PPp')}</div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="discussion" className="border-0">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Discussion & Respond
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <TicketConversation ticketId={ticket.id} isAdmin={true} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
