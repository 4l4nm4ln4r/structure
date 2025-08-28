import React from 'react';
import { TodoPanel } from './panels/TodoPanel';
import { NotesPanel } from './panels/NotesPanel';
import { LinksPanel } from './panels/LinksPanel';

interface MainPanelProps {
  section: string;
  activeItem: string | null;
  items: any[];
  onItemUpdate: (itemId: string, updates: any) => void;
}

export function MainPanel({ section, activeItem, items, onItemUpdate }: MainPanelProps) {
  const currentItem = items.find(item => item.id === activeItem);

  if (!activeItem || !currentItem) {
    return (
      <div className="panel-main flex-1 flex items-center justify-center">
        <div className="text-center text-[hsl(var(--text-secondary))]">
          <h3 className="text-lg font-medium mb-2">
            Select {section === 'todos' ? 'a list' : section === 'notes' ? 'a category' : 'a collection'} to get started
          </h3>
          <p className="text-sm">
            Choose an item from the sidebar to view its contents
          </p>
        </div>
      </div>
    );
  }

  const renderPanel = () => {
    switch (section) {
      case 'todos':
        return <TodoPanel item={currentItem} onUpdate={onItemUpdate} />;
      case 'notes':
        return <NotesPanel item={currentItem} onUpdate={onItemUpdate} />;
      case 'links':
        return <LinksPanel item={currentItem} onUpdate={onItemUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="panel-main flex-1 flex flex-col">
      {renderPanel()}
    </div>
  );
}