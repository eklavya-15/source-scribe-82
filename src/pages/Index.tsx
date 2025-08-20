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

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: "I've processed your question based on the available sources.",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  }, [sources, toast]);

  return (
    <div className="h-screen bg-background flex">
      <div className="w-80 flex-shrink-0">
        <SourceManager
          sources={sources}
          onAddSource={addSource}
          onRemoveSource={removeSource}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow messages={messages} isLoading={isLoading} />
        
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