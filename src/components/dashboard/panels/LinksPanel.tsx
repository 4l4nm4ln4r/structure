import React, { useState } from 'react';
import { ExternalLink, Plus, Globe, Tag, Trash2, Edit2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

function SortableLinkItem({ 
  link, 
  onDelete, 
  onEditTitle, 
  isEditing, 
  editingText, 
  setEditingText, 
  setIsEditing,
  getFaviconUrl 
}: {
  link: LinkItem;
  onDelete: (id: string) => void;
  onEditTitle: (id: string, newTitle: string) => void;
  isEditing: boolean;
  editingText: string;
  setEditingText: (text: string) => void;
  setIsEditing: (editing: boolean) => void;
  getFaviconUrl: (url: string) => string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveEdit = () => {
    if (editingText.trim()) {
      onEditTitle(link.id, editingText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingText(link.title);
      setIsEditing(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="content-card group hover:border-[hsl(var(--dashboard-accent))] transition-colors">
      <div className="flex items-start gap-3">
        <div 
          {...attributes} 
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
        >
          <GripVertical size={14} />
        </div>
        
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
            {isEditing ? (
              <input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyPress}
                className="dashboard-input flex-1"
                autoFocus
              />
            ) : (
              <h3 className="font-medium text-[hsl(var(--text-primary))] truncate">
                {link.title}
              </h3>
            )}
            <div className="flex items-center gap-1 ml-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-all"
              >
                <Edit2 size={12} />
              </button>
              <button 
                onClick={() => onDelete(link.id)}
                className="opacity-0 group-hover:opacity-100 text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--error))] transition-all"
              >
                <Trash2 size={12} />
              </button>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 text-[hsl(var(--dashboard-accent))] hover:text-[hsl(var(--dashboard-accent-hover))] transition-all"
              >
                <ExternalLink size={12} />
              </a>
            </div>
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
  );
}

export function LinksPanel({ item, onUpdate }: LinksPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const deleteLink = (linkId: string) => {
    const updatedLinks = item.links.filter(link => link.id !== linkId);
    onUpdate(item.id, { links: updatedLinks });
  };

  const editLinkTitle = (linkId: string, newTitle: string) => {
    const updatedLinks = item.links.map(link =>
      link.id === linkId ? { ...link, title: newTitle } : link
    );
    onUpdate(item.id, { links: updatedLinks });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = item.links.findIndex(link => link.id === active.id);
      const newIndex = item.links.findIndex(link => link.id === over.id);
      
      const newLinks = arrayMove(item.links, oldIndex, newIndex);
      onUpdate(item.id, { links: newLinks });
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={item.links.map(link => link.id)} strategy={rectSortingStrategy}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {item.links.map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    onDelete={deleteLink}
                    onEditTitle={editLinkTitle}
                    isEditing={editingId === link.id}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    setIsEditing={(editing) => {
                      if (editing) {
                        setEditingId(link.id);
                        setEditingText(link.title);
                      } else {
                        setEditingId(null);
                        setEditingText('');
                      }
                    }}
                    getFaviconUrl={getFaviconUrl}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
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