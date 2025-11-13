import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ticketOperations } from '@/integrations/supabase/tickets';
import { TicketMessage } from '@/types/ticketMessage';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Send, User, Shield, MessageSquare, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface TicketConversationProps {
  ticketId: string;
  isAdmin?: boolean;
}

export const TicketConversation = ({ ticketId, isAdmin = false }: TicketConversationProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [ticketId]);

  const fetchMessages = async () => {
    try {
      const data = await ticketOperations.getTicketMessages(ticketId);
      setMessages(data);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      await ticketOperations.createTicketMessage({
        ticket_id: ticketId,
        message: newMessage.trim(),
        attachments: [],
        is_admin: isAdmin,
      });
      
      toast.success('Message sent successfully');
      setNewMessage('');
      fetchMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion & Follow-ups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages list */}
        {messages.length === 0 ? (
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              No messages yet. {isAdmin ? 'Start the conversation with the user.' : 'Ask a question or provide additional information.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.is_admin ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.is_admin ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {message.is_admin ? (
                    <Shield className="w-4 h-4 text-blue-600" />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                
                <div className={`flex-1 ${message.is_admin ? 'text-left' : 'text-right'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={message.is_admin ? 'default' : 'secondary'} className="text-xs">
                      {message.is_admin ? 'Admin' : 'User'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.created_at), 'PPp')}
                    </span>
                  </div>
                  
                  <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.is_admin 
                      ? 'bg-blue-50 border border-blue-200 text-blue-900' 
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 pt-2 border-t space-y-1">
                        {message.attachments.map((attachment: any, idx: number) => (
                          <a
                            key={idx}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Paperclip className="w-3 h-3" />
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message input */}
        <div className="border-t pt-4 space-y-2">
          <Textarea
            placeholder={isAdmin ? "Reply to the user..." : "Ask a question or provide more details..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
            disabled={sending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
            <Button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              size="sm"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketConversation;
