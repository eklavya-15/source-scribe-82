import React, { useState, useCallback } from 'react';
import { SourceManager, Source } from '@/components/SourceManager';
import { ChatWindow, ChatMessage } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock AI responses with source references
  const mockResponses = [
    {
      content: "Based on your sources, I can provide insights about the topics you've uploaded. The content suggests several key themes that I can analyze for you.",
      sources: ['text', 'pdf', 'link'] as const,
    },
    {
      content: "That's an interesting question! From the materials you've provided, I can see that this topic is covered across multiple sources with different perspectives.",
      sources: ['text', 'pdf'] as const,
    },
    {
      content: "According to the documents you've uploaded, there are several important points to consider. Let me break down what I found in your sources.",
      sources: ['pdf', 'link'] as const,
    },
    {
      content: "I found relevant information in your uploaded content that directly addresses your question. Here's what the sources reveal about this topic.",
      sources: ['text', 'link'] as const,
    },
  ];

  const addSource = useCallback((sourceData: Omit<Source, 'id' | 'addedAt'>) => {
    const newSource: Source = {
      ...sourceData,
      id: Date.now().toString(),
      addedAt: new Date(),
    };
    setSources(prev => [...prev, newSource]);
  }, []);

  const removeSource = useCallback((id: string) => {
    setSources(prev => prev.filter(source => source.id !== id));
    toast({
      title: "Source removed",
      description: "Source has been removed from your collection",
    });
  }, [toast]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (sources.length === 0) {
      toast({
        title: "No sources available",
        description: "Please add some sources before asking questions",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    // Generate mock response
    const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Create referenced sources based on available sources
    const availableSourceTypes = sources.map(s => s.type);
    const referencedSources = mockResponse.sources
      .filter(type => availableSourceTypes.includes(type))
      .map(type => {
        const source = sources.find(s => s.type === type);
        return source ? { type: source.type, title: source.title } : null;
      })
      .filter(Boolean) as Array<{ type: 'text' | 'pdf' | 'link'; title: string }>;

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: mockResponse.content,
      timestamp: new Date(),
      sources: referencedSources.length > 0 ? referencedSources : undefined,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  }, [sources, toast]);

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <SourceManager
          sources={sources}
          onAddSource={addSource}
          onRemoveSource={removeSource}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Messages */}
        <ChatWindow messages={messages} isLoading={isLoading} />
        
        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={sources.length === 0}
        />
      </div>
    </div>
  );
};

export default Index;