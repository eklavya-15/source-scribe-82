import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface ChatInputRef {
  clearChat: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSendMessage }, ref) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { toast } = useToast();

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  useImperativeHandle(ref, () => ({
    clearChat: clearChatHistory
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setIsLoading(true);
    
    const userChatMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userChatMessage]);
    setMessage('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Chat failed`);
      }

      const result = await res.json();
      console.log("Chat response:", result);

      const aiChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.response,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiChatMessage]);

      onSendMessage(userMessage);
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Chat failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Start a conversation with your AI assistant</p>
            <p className="text-xs mt-1">Type a message to begin chatting</p>
          </div>
        ) : (
          chatHistory.map((chatMessage) => (
            <div
              key={chatMessage.id}
              className={`flex gap-3 ${
                chatMessage.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {chatMessage.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  chatMessage.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{chatMessage.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {chatMessage.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {chatMessage.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-border">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
});