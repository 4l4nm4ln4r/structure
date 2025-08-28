import React from 'react';
import { CheckSquare, FileText, Link, Settings } from 'lucide-react';

interface NavigationSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onSettingsOpen: () => void;
}

const navigationItems = [
  { id: 'todos', icon: CheckSquare, label: 'To-Dos' },
  { id: 'notes', icon: FileText, label: 'Notes' },
  { id: 'links', icon: Link, label: 'Links' },
];

export function NavigationSidebar({ activeSection, onSectionChange, onSettingsOpen }: NavigationSidebarProps) {
  return (
    <div className="panel-nav w-14 flex flex-col">
      <div className="flex-1 flex flex-col items-center py-4 gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
      
      <div className="border-t border-[hsl(var(--border-primary))] pt-4 pb-4 flex justify-center">
        <button
          onClick={onSettingsOpen}
          className="nav-item"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}