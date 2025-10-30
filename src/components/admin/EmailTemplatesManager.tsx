'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Save, Mail, RefreshCw, Code } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  description: string;
}

export default function EmailTemplatesManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [previewData, setPreviewData] = useState('{\n  "name": "John Doe",\n  "bookingId": "BK123456",\n  "date": "2025-11-15"\n}');

  // Available template variables
  const availableVariables = [
    { name: 'customerName', description: 'Full name of the customer' },
    { name: 'bookingId', description: 'Unique booking reference number' },
    { name: 'bookingDate', description: 'Date of booking' },
    { name: 'tourName', description: 'Name of the booked tour' },
    { name: 'startDate', description: 'Tour start date' },
    { name: 'endDate', description: 'Tour end date' },
    { name: 'totalAmount', description: 'Total booking amount' },
    { name: 'paymentStatus', description: 'Current payment status' },
    { name: 'bookingLink', description: 'Link to view booking details' },
    { name: 'contactEmail', description: 'Customer support email' },
    { name: 'contactPhone', description: 'Customer support phone' },
  ];

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/email-templates');
      const data = await response.json();
      setTemplates(data);
      if (data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(data[0]);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load email templates');
    } finally {
      setIsLoading(false);
    }
  };

  // Save template
  const saveTemplate = async () => {
    if (!selectedTemplate) return;
    
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/email-templates/${selectedTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTemplate),
      });

      if (response.ok) {
        toast.success('Template saved successfully');
        fetchTemplates();
      } else {
        throw new Error('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  // Send test email
  const sendTestEmail = async () => {
    if (!selectedTemplate) return;
    
    try {
      const response = await fetch('/api/admin/email-templates/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          to: 'test@example.com',
          data: JSON.parse(previewData),
        }),
      });

      if (response.ok) {
        toast.success('Test email sent successfully');
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    }
  };

  // Initialize component
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate({...template});
    }
  };

  // Insert variable into content
  const insertVariable = (variable: string) => {
    if (!selectedTemplate) return;
    
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    setSelectedTemplate({
      ...selectedTemplate,
      content: `${before}{{${variable}}}${after}`,
    });
    
    // Focus back on the textarea
    setTimeout(() => {
      const newPosition = start + variable.length + 4; // +4 for {{}}
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchTemplates} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {selectedTemplate && (
            <Button onClick={saveTemplate} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => handleTemplateChange(template.id)}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500 truncate">{template.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Editor */}
        {selectedTemplate && (
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedTemplate.name}</CardTitle>
                  <Button variant="outline" size="sm" onClick={sendTestEmail}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test Email
                  </Button>
                </div>
                <p className="text-sm text-gray-500">{selectedTemplate.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-subject">Email Subject</Label>
                    <Input
                      id="template-subject"
                      value={selectedTemplate.subject}
                      onChange={(e) =>
                        setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })
                      }
                      placeholder="Enter email subject"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Email Content</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={activeTab === 'editor' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveTab('editor')}
                        >
                          <Code className="w-4 h-4 mr-1" />
                          Editor
                        </Button>
                        <Button
                          variant={activeTab === 'preview' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveTab('preview')}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>

                    {activeTab === 'editor' ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-sm text-gray-500 self-center mr-2">Insert:</span>
                          {availableVariables.map((variable) => (
                            <Button
                              key={variable.name}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => insertVariable(variable.name)}
                              title={variable.description}
                            >
                              {`{{${variable.name}}}`}
                            </Button>
                          ))}
                        </div>
                        <Textarea
                          id="template-content"
                          value={selectedTemplate.content}
                          onChange={(e) =>
                            setSelectedTemplate({ ...selectedTemplate, content: e.target.value })
                          }
                          className="min-h-[400px] font-mono text-sm"
                          placeholder="Enter email content here..."
                        />
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 min-h-[400px] bg-white">
                        <h3 className="text-lg font-semibold mb-2">{selectedTemplate.subject}</h3>
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: selectedTemplate.content.replace(
                              /\{\{([^}]+)\}\}/g,
                              (match, variable) =>
                                `<span class="bg-yellow-100 text-yellow-800 px-1 rounded border border-yellow-200">${variable}</span>`
                            ),
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Available Variables</Label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableVariables.map((variable) => (
                        <div
                          key={variable.name}
                          className="p-2 border rounded-md text-sm bg-gray-50"
                          title={variable.description}
                        >
                          <code className="font-mono bg-gray-100 px-1 rounded">
                            {`{{${variable.name}}}`}
                          </code>
                          <p className="text-gray-600 mt-1">{variable.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Email</CardTitle>
                <p className="text-sm text-gray-500">
                  Send a test email with sample data to verify the template
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-email">Recipient Email</Label>
                    <Input
                      id="test-email"
                      type="email"
                      defaultValue="test@example.com"
                      placeholder="Enter recipient email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="test-data">Test Data (JSON)</Label>
                    <Textarea
                      id="test-data"
                      value={previewData}
                      onChange={(e) => setPreviewData(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                      placeholder="Enter test data in JSON format"
                    />
                  </div>
                  <Button onClick={sendTestEmail}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
