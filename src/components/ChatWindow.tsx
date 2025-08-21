import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Bot, FileText, Upload, Link } from 'lucide-react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    type: 'text' | 'pdf' | 'link';
    title: string;
  }>;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getSourceIcon = (type: 'text' | 'pdf' | 'link') => {
    switch (type) {
      case 'text':
        return <FileText className="h-3 w-3" />;
      case 'pdf':
        return <Upload className="h-3 w-3" />;
      case 'link':
        return <Link className="h-3 w-3" />;
    }
  };

  const getSourceBadgeVariant = (type: 'text' | 'pdf' | 'link') => {
    switch (type) {
      case 'text':
        return 'secondary';
      case 'pdf':
        return 'outline';
      case 'link':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-surface rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <Bot className="h-12 w-12 text-primary mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Welcome to your Knowledge Assistant
            </h3>
            <p className="text-text-muted max-w-md mx-auto">
              Add some sources using the sidebar, then ask me anything about them. 
              I'll provide answers grounded in your uploaded content.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              } animate-slide-in-up animate-fill-both animate-delay-${Math.min(index * 50, 300)}`}
            >
              {message.type === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="bg-gradient-primary rounded-full p-2 w-8 h-8 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
                <Card
                  className={`p-4 shadow-notebook ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-notebook-paper'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        message.type === 'user'
                          ? 'text-primary-foreground'
                          : 'text-text-primary'
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-notebook-line">
                      <p className="text-xs text-text-muted mb-2 font-medium">
                        Sources referenced:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source, index) => (
                          <Badge
                            key={index}
                            variant={getSourceBadgeVariant(source.type)}
                            className="text-xs flex items-center gap-1"
                          >
                            {getSourceIcon(source.type)}
                            {source.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
                
                <p className="text-xs text-text-placeholder mt-1 px-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.type === 'user' && (
                <div className="flex-shrink-0 order-2">
                  <div className="bg-surface-secondary rounded-full p-2 w-8 h-8 flex items-center justify-center">
                    <User className="h-4 w-4 text-text-secondary" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-4 justify-start animate-fade-in">
            <div className="flex-shrink-0">
              <div className="bg-gradient-primary-vibrant rounded-full p-2 w-8 h-8 flex items-center justify-center animate-pulse">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="max-w-2xl">
              <Card className="p-4 shadow-notebook bg-notebook-paper">
                <div className="flex items-center gap-2 text-text-muted">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};