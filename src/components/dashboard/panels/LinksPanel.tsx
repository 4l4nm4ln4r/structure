import React, { useState } from 'react';
import { ExternalLink, Plus, Globe, Tag } from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  favicon?: string;
  addedDate: string;
}

interface LinksPanelProps {
  item: {
    id: string;
    name: string;
    links: LinkItem[];
  };
  onUpdate: (itemId: string, updates: any) => void;
}

export function LinksPanel({ item, onUpdate }: LinksPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
  });

  const addLink = () => {
    if (newLink.url.trim() && newLink.title.trim()) {
      const link: LinkItem = {
        id: Date.now().toString(),
        title: newLink.title.trim(),
        url: newLink.url.trim(),
        description: newLink.description.trim(),
        tags: [],
        addedDate: new Date().toLocaleDateString(),
      };
      
      onUpdate(item.id, {
        links: [...item.links, link]
      });
      
      setNewLink({ title: '', url: '', description: '' });
      setIsAdding(false);
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border-primary))] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
              {item.name}
            </h1>
            <p className="text-[hsl(var(--text-secondary))] mt-1">
              {item.links.length} saved links
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto dashboard-scroll">
        <div className="max-w-4xl space-y-4">
          {/* Add new link */}
          {isAdding && (
            <div className="content-card border-dashed border-2 border-[hsl(var(--dashboard-accent))]">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  placeholder="Link title"
                  className="dashboard-input w-full"
                  autoFocus
                />
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://example.com"
                  className="dashboard-input w-full"
                />
                <textarea
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  placeholder="Optional description"
                  className="dashboard-input w-full resize-none h-20"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={addLink}
                    className="btn-primary"
                  >
                    Add Link
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewLink({ title: '', url: '', description: '' });
                    }}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Links grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {item.links.map((link) => (
              <div key={link.id} className="content-card group hover:border-[hsl(var(--dashboard-accent))] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {getFaviconUrl(link.url) ? (
                      <img
                        src={getFaviconUrl(link.url)!}
                        alt=""
                        className="w-6 h-6"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Globe size={16} className={`text-[hsl(var(--text-secondary))] ${getFaviconUrl(link.url) ? 'hidden' : ''}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-[hsl(var(--text-primary))] truncate">
                        {link.title}
                      </h3>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 text-[hsl(var(--dashboard-accent))] hover:text-[hsl(var(--dashboard-accent-hover))] transition-all ml-2"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    
                    <p className="text-xs text-[hsl(var(--text-muted))] truncate mt-1">
                      {new URL(link.url).hostname}
                    </p>
                    
                    {link.description && (
                      <p className="text-sm text-[hsl(var(--text-secondary))] mt-2 line-clamp-3">
                        {link.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-[hsl(var(--text-muted))]">
                      <span>{link.addedDate}</span>
                      {link.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag size={10} />
                          <span>{link.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {item.links.length === 0 && !isAdding && (
            <div className="text-center py-12 text-[hsl(var(--text-secondary))]">
              <Globe size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No links saved yet</h3>
              <p className="text-sm">Add your first link to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}