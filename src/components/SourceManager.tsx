import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Upload, Link, FileText, Trash2, X } from 'lucide-react';

export interface Source {
  id: string;
  type: 'text' | 'pdf' | 'link';
  title: string;
  content?: string; 
  url?: string;
  fileName?: string;
  addedAt: Date;
}

interface SourceManagerProps {
  sources: Source[];
  onAddSource: (source: Omit<Source, 'id' | 'addedAt'>) => void;
  onRemoveSource: (id: string) => void;
}

export const SourceManager: React.FC<SourceManagerProps> = ({
  sources,
  onAddSource,
  onRemoveSource,
}) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const { toast } = useToast();

  const handleTextSubmit = async () => {
    if (!textContent.trim() || !textTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send text to backend for embedding
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/embed-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: textTitle,
          content: textContent,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to embed text`);
      }

      const result = await res.json();
      console.log("Text embedding response:", result);

      // Add source to UI after successful embedding
      onAddSource({
        type: 'text',
        title: textTitle,
        content: textContent,
      });

      setTextContent('');
      setTextTitle('');
      setShowTextInput(false);
      
      toast({
        title: "Text source added",
        description: result.message || `Added "${textTitle}" to your sources`,
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Text embedding failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLinkSubmit = async () => {
    if (!linkUrl.trim() || !linkTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and URL",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send URL to backend for embedding
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/embed-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: linkTitle,
          url: linkUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to embed URL`);
      }

      const result = await res.json();
      console.log("URL embedding response:", result);

      // Add source to UI after successful embedding
      onAddSource({
        type: 'link',
        title: linkTitle,
        url: linkUrl,
      });

      setLinkUrl('');
      setLinkTitle('');
      setShowLinkInput(false);
      
      toast({
        title: "Link source added",
        description: result.message || `Added "${linkTitle}" to your sources`,
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "URL embedding failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // send file to backend
      const formData = new FormData();
      formData.append("pdf", file);
      console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
      console.log("File being sent:", file.name, file.size, file.type);
      
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/embed-pdf`, {
        method: "POST",
        body: formData,
      }).catch(error => {
        console.error("Fetch error:", error);
        throw new Error(`Network error: ${error.message}`);
      });

      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to upload PDF`);
      }

      const result = await res.json();
      console.log("Backend response:", result);

      // Once backend confirms embedding success, update UI state
      onAddSource({
        type: "pdf",
        title: file.name,
        fileName: file.name,
      });

      // Only clear chat, don't clear sources
      // Clear chat
      // Clear all sources from UI
      sources.forEach(source => {
        onRemoveSource(source.id);
      });

      toast({
        title: "PDF uploaded",
        description: result.message || `Embedded and added "${file.name}"`,
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  
    // Reset the input
    event.target.value = "";
  };

  const handleClearAllSources = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sources/clear`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to clear sources`);
      }

      const result = await res.json();
      console.log("Clear sources response:", result);

      // Clear all sources from UI
      sources.forEach(source => {
        onRemoveSource(source.id);
      });

      toast({
        title: "All sources cleared",
        description: "All sources and embeddings have been removed",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Clear failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'pdf':
        return <Upload className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
    }
  };

  const getSourceBadgeVariant = (type: Source['type']) => {
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
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-surface">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Your Sources</h2>
            <p className="text-sm text-text-muted mt-1">
              {sources.length} source{sources.length !== 1 ? 's' : ''} added
            </p>
          </div>
          {sources.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAllSources}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Add Source Controls */}
      <div className="p-4 space-y-3 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTextInput(!showTextInput)}
            className="flex-1 min-w-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Text
          </Button>
          
          <label className="flex-1 min-w-0">
            <Button variant="outline" size="sm" className="w-full cursor-pointer" asChild>
              <span>
                <Upload className="h-4 w-4 mr-1" />
                PDF
              </span>
            </Button>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />
          </label>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="flex-1 min-w-0"
          >
            <Link className="h-4 w-4 mr-1" />
            Link
          </Button>
        </div>

        {/* Text Input Form */}
        {showTextInput && (
          <Card className="p-3 bg-notebook-paper shadow-sm">
            <div className="space-y-3">
              <Input
                placeholder="Source title..."
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                className="text-sm"
              />
              <Textarea
                placeholder="Paste your text content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={4}
                className="text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleTextSubmit} className="flex-1">
                  Add Source
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowTextInput(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Link Input Form */}
        {showLinkInput && (
          <Card className="p-3 bg-notebook-paper shadow-sm">
            <div className="space-y-3">
              <Input
                placeholder="Source title..."
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleLinkSubmit} className="flex-1">
                  Add Link
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLinkInput(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sources.length === 0 ? (
          <div className="text-center text-text-muted py-8">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sources added yet</p>
            <p className="text-xs mt-1">Add text, PDFs, or links to get started</p>
          </div>
        ) : (
          sources.map((source) => (
            <Card key={source.id} className="p-3 bg-notebook-paper shadow-sm hover:shadow transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getSourceIcon(source.type)}
                    <Badge variant={getSourceBadgeVariant(source.type)} className="text-xs">
                      {source.type.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm text-text-primary truncate">
                    {source.title}
                  </h4>
                  {source.content && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">
                      {source.content.slice(0, 100)}...
                    </p>
                  )}
                  {source.url && (
                    <p className="text-xs text-text-muted mt-1 truncate">
                      {source.url}
                    </p>
                  )}
                  <p className="text-xs text-text-placeholder mt-1">
                    Added {source.addedAt.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveSource(source.id)}
                  className="h-8 w-8 p-0 text-text-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};