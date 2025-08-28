import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';

interface ContentSidebarProps {
  section: string;
  items: any[];
  activeItem: string | null;
  onItemSelect: (itemId: string) => void;
  onItemAdd: (name: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const sectionConfig = {
  todos: {
    title: 'TO-DO LISTS',
    placeholder: 'Search lists...',
    addLabel: 'Add new list',
  },
  notes: {
    title: 'NOTES CATEGORIES',
    placeholder: 'Search categories...',
    addLabel: 'Add new category',
  },
  links: {
    title: 'LINK COLLECTIONS',
    placeholder: 'Search collections...',
    addLabel: 'Add new collection',
  },
};

export function ContentSidebar({
  section,
  items,
  activeItem,
  onItemSelect,
  onItemAdd,
  searchTerm,
  onSearchChange,
}: ContentSidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  
  const config = sectionConfig[section as keyof typeof sectionConfig];
  if (!config) return null;

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (newItemName.trim()) {
      onItemAdd(newItemName.trim());
      setNewItemName('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewItemName('');
    }
  };

  return (
    <div className="panel-sidebar w-64 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--border-primary))]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-[hsl(var(--text-muted))] uppercase tracking-wide">
            {config.title}
          </h2>
          <button
            onClick={() => setIsAdding(true)}
            className="text-[hsl(var(--dashboard-accent))] hover:text-[hsl(var(--dashboard-accent-hover))] transition-colors"
            title={config.addLabel}
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--text-secondary))]" />
          <input
            type="text"
            placeholder={config.placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="dashboard-input w-full pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto dashboard-scroll">
        <div className="p-2">
          {isAdding && (
            <div className="mb-2">
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
                placeholder={`New ${section.slice(0, -1)}...`}
                className="dashboard-input w-full text-sm"
                autoFocus
              />
            </div>
          )}
          
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemSelect(item.id)}
              className={`sidebar-item text-sm ${activeItem === item.id ? 'active' : ''}`}
            >
              <span className="flex-1 truncate">{item.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-[hsl(var(--text-secondary))]">
                  {item.count || 0}
                </span>
                <button className="opacity-0 group-hover:opacity-100 text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-all">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && !isAdding && (
            <div className="text-center py-8 text-[hsl(var(--text-secondary))] text-sm">
              {searchTerm ? 'No items found' : `No ${section} yet`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}