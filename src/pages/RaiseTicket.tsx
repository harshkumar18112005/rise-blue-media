import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ticketOperations } from '@/integrations/supabase/tickets';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, Loader2, CheckCircle, Copy } from 'lucide-react';

const RaiseTicket = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get('service');
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [generatedTicketId, setGeneratedTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to raise a ticket');
      navigate('/auth');
      return;
    }

    setLoading(true);
    
    try {
      const attachments: Array<{ name: string; url: string; size: number }> = [];
      
      // Upload files if any
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const uploadedFile = await ticketOperations.uploadAttachment(file);
          attachments.push(uploadedFile);
        }
      }
      
      // Create ticket
      const ticket = await ticketOperations.createTicket({
        service_id: serviceName || undefined,
        subject,
        description,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      
      setGeneratedTicketId(ticket.id);
      toast.success('Ticket raised successfully!');
      
      // Reset form
      setSubject('');
      setDescription('');
      setFiles(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to raise ticket');
    } finally {
      setLoading(false);
    }
  };

  const copyTicketId = () => {
    if (generatedTicketId) {
      navigator.clipboard.writeText(generatedTicketId);
      toast.success('Ticket ID copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Raise a Support Ticket</CardTitle>
            <CardDescription>
              {serviceName ? `For service: ${serviceName}` : 'Submit your concerns, doubts, or issues'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedTicketId && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Ticket Created Successfully!</AlertTitle>
                <AlertDescription className="text-green-700">
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono font-semibold">{generatedTicketId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyTicketId}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="link"
                      onClick={() => navigate('/my-tickets')}
                      className="h-auto p-0 text-green-700 underline"
                    >
                      View all your tickets
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information about your concern..."
                  rows={6}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="cursor-pointer"
                    disabled={loading}
                  />
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You can upload multiple files (images, documents, etc.)
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default RaiseTicket;
