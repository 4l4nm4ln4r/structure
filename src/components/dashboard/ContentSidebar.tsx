import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentSidebarProps {
  section: string;
  items: any[];
  activeItem: string | null;
  searchTerm: string;
  onItemSelect: (itemId: string) => void;
  onItemAdd: (name: string) => void;
  onItemUpdate: (itemId: string, updates: any) => void;
  onItemReorder: (items: any[]) => void;
  onItemDelete: (itemId: string) => void;
  onSearchChange: (term: string) => void;
}

const sectionConfig = {
  todos: {
    title: 'To-Do Lists',
    placeholder: 'Search lists...',
    addLabel: 'Add List',
  },
  notes: {
    title: 'Notes',
    placeholder: 'Search notes...',
    addLabel: 'Add Note',
  },
  links: {
    title: 'Link Collections',
    placeholder: 'Search collections...',
    addLabel: 'Add Collection',
  },
};

function SortableItem({ 
  item, 
  section, 
  isActive, 
  onSelect, 
  onDelete, 
  onEditTitle, 
  isEditing, 
  editingText, 
  setEditingText, 
  setIsEditing 
}: {
  item: any;
  section: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEditTitle: (id: string, newName: string) => void;
  isEditing: boolean;
  editingText: string;
  setEditingText: (text: string) => void;
  setIsEditing: (editing: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveEdit = () => {
    if (editingText.trim()) {
      onEditTitle(item.id, editingText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingText(item.name);
      setIsEditing(false);
    }
  };

  const getItemCount = () => {
    if (section === 'todos') return item.todos?.length || 0;
    if (section === 'links') return item.links?.length || 0;
    return 0; // Notes don't have sub-items
  };

  if (section === 'notes') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        onClick={() => onSelect(item.id)}
        className={`sidebar-item group ${isActive ? 'active' : ''}`}
      >
        
        <div className="flex-1 min-w-0">
          <div className="content-card hover:border-[hsl(var(--dashboard-accent))] cursor-pointer transition-colors">
            <div className="flex items-center justify-between mb-2">
              {isEditing ? (
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyPress}
                  className="dashboard-input flex-1"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="font-medium text-[hsl(var(--text-primary))] truncate">
                  {item.title || 'Untitled Note'}
                </h3>
              )}
              <span className="text-xs text-[hsl(var(--text-secondary))]">
                {item.lastModified}
              </span>
            </div>
            <div 
              className="text-sm text-[hsl(var(--text-secondary))] line-clamp-2 mb-2 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: item.content ? item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '') : 'No content'
              }}
            />
            {(item.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(item.tags || []).slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-[hsl(var(--hover-bg))] text-[hsl(var(--text-secondary))] px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {(item.tags || []).length > 3 && (
                  <span className="text-xs text-[hsl(var(--text-secondary))]">
                    +{(item.tags || []).length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <div 
            {...attributes} 
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={12} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(item.id)}
      className={`sidebar-item group ${isActive ? 'active' : ''}`}
    >
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyPress}
            className="dashboard-input w-full"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="font-medium truncate">{item.name}</span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-[hsl(var(--text-secondary))] bg-[hsl(var(--hover-bg))] px-2 py-1 rounded">
          {getItemCount()}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <div 
            {...attributes} 
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentSidebar({ 
  section, 
  items, 
  activeItem, 
  searchTerm, 
  onItemSelect, 
  onItemAdd, 
  onItemUpdate,
  onItemReorder,
  onItemDelete,
  onSearchChange 
}: ContentSidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const config = sectionConfig[section as keyof typeof sectionConfig];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter items based on search term and section
  const filteredItems = items.filter(item => {
    if (section === 'notes') {
      return (
        (item.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.content?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.tags || []).some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else {
      return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const addItem = () => {
    if (newItemName.trim()) {
      onItemAdd(newItemName.trim());
      setNewItemName('');
      setIsAdding(false);
    }
  };

  const editItemTitle = (itemId: string, newName: string) => {
    if (section === 'notes') {
      onItemUpdate(itemId, { title: newName });
    } else {
      onItemUpdate(itemId, { name: newName });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredItems.findIndex(item => item.id === active.id);
      const newIndex = filteredItems.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(filteredItems, oldIndex, newIndex);
      onItemReorder(newItems);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewItemName('');
    }
  };

  return (
    <div className="panel-sidebar w-80 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--border-primary))]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            {config?.title}
          </h2>
          <button
            onClick={() => setIsAdding(true)}
            className="text-[hsl(var(--dashboard-accent))] hover:text-[hsl(var(--dashboard-accent-hover))] transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--text-secondary))]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={config?.placeholder}
            className="dashboard-input w-full pl-9"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto dashboard-scroll p-4">
        <div className="space-y-2">
          {/* Add new item */}
          {isAdding && (
            <div className="p-3 border-2 border-dashed border-[hsl(var(--dashboard-accent))] rounded-md">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={() => {
                  if (!newItemName.trim()) {
                    setIsAdding(false);
                  }
                }}
                placeholder={`New ${section === 'todos' ? 'list' : section === 'notes' ? 'note' : 'collection'} name...`}
                className="dashboard-input w-full"
                autoFocus
              />
            </div>
          )}

          {/* Items list */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={filteredItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {filteredItems.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  section={section}
                  isActive={activeItem === item.id}
                  onSelect={onItemSelect}
                  onDelete={onItemDelete}
                  onEditTitle={editItemTitle}
                  isEditing={editingId === item.id}
                  editingText={editingText}
                  setEditingText={setEditingText}
                  setIsEditing={(editing) => {
                    if (editing) {
                      setEditingId(item.id);
                      setEditingText(section === 'notes' ? item.title || '' : item.name || '');
                    } else {
                      setEditingId(null);
                      setEditingText('');
                    }
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {/* Empty state */}
          {filteredItems.length === 0 && searchTerm && (
            <div className="text-center py-8 text-[hsl(var(--text-secondary))]">
              <p>No items found matching "{searchTerm}"</p>
            </div>
          )}
          
          {filteredItems.length === 0 && !searchTerm && !isAdding && (
            <div className="text-center py-8 text-[hsl(var(--text-secondary))]">
              <p className="mb-2">No {section} yet</p>
              <button
                onClick={() => setIsAdding(true)}
                className="text-[hsl(var(--dashboard-accent))] hover:text-[hsl(var(--dashboard-accent-hover))] text-sm"
              >
                {config?.addLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}