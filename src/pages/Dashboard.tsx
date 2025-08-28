import React, { useState } from 'react';
import { NavigationSidebar } from '../components/dashboard/NavigationSidebar';
import { ContentSidebar } from '../components/dashboard/ContentSidebar';
import { MainPanel } from '../components/dashboard/MainPanel';
import { SettingsModal } from '../components/dashboard/SettingsModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';

interface DashboardItem {
  id: string;
  name: string;
  count?: number;
  todos?: any[];
  notes?: any[];
  links?: any[];
}

const initialData = {
  todos: [
    { 
      id: 'work', 
      name: 'Work', 
      count: 4,
      todos: [
        { id: '1', text: 'Finish report (due today)', completed: false, priority: 'high' },
        { id: '2', text: 'Email client', completed: true, priority: 'medium' },
        { id: '3', text: 'Plan presentation (priority: high)', completed: false, priority: 'high' },
        { id: '4', text: 'Book flights', completed: false, priority: 'low' }
      ]
    },
    { id: 'personal', name: 'Personal', count: 2, todos: [] },
    { id: 'errands', name: 'Errands', count: 0, todos: [] }
  ],
  notes: [
    { 
      id: 'meeting', 
      name: 'Meeting Notes', 
      count: 3,
      notes: [
        {
          id: '1',
          title: 'Project X Kickoff',
          content: '# Kickoff Meeting\n\n- Budget needs final approval\n- Timeline draft due next week\n\n## Action Items\n- [ ] Confirm stakeholder list\n- [ ] Send follow-up email',
          tags: ['project-x', 'meeting'],
          lastModified: '2024-01-15'
        }
      ]
    },
    { id: 'ideas', name: 'Ideas', count: 5, notes: [] },
    { id: 'drafts', name: 'Drafts', count: 1, notes: [] }
  ],
  links: [
    { 
      id: 'reading', 
      name: 'Reading List', 
      count: 8,
      links: [
        {
          id: '1',
          title: 'ChatGPT - Conversational AI assistant',
          url: 'https://openai.com',
          description: 'OpenAI\'s conversational AI assistant for various tasks',
          tags: ['ai', 'tools'],
          addedDate: '2024-01-10'
        },
        {
          id: '2', 
          title: 'My Repo - Personal project codebase',
          url: 'https://github.com',
          description: 'Personal project repository on GitHub',
          tags: ['code', 'personal'],
          addedDate: '2024-01-08'
        },
        {
          id: '3',
          title: 'Productivity hacks I like',
          url: 'https://medium.com/article-xyz',
          description: 'Useful productivity tips and techniques',
          tags: ['productivity', 'tips'],
          addedDate: '2024-01-05'
        }
      ]
    },
    { id: 'tools', name: 'Tools', count: 12, links: [] },
    { id: 'favorites', name: 'Favorites', count: 6, links: [] }
  ]
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState('todos');
  const [activeItem, setActiveItem] = useState<string | null>('work');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [data, setData] = useLocalStorage('dashboard-data', initialData);
  const { theme, setTheme } = useTheme();

  const currentItems = data[activeSection as keyof typeof data] || [];
  
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const sectionItems = data[section as keyof typeof data] || [];
    setActiveItem(sectionItems.length > 0 ? sectionItems[0].id : null);
    setSearchTerm('');
  };

  const handleItemAdd = (name: string) => {
    const newItem: DashboardItem = {
      id: Date.now().toString(),
      name,
      count: 0,
      todos: [],
      notes: [],
      links: []
    };
    
    setData(prev => ({
      ...prev,
      [activeSection]: [...prev[activeSection as keyof typeof prev], newItem]
    }));
    
    setActiveItem(newItem.id);
  };

  const handleItemUpdate = (itemId: string, updates: any) => {
    setData(prev => ({
      ...prev,
      [activeSection]: prev[activeSection as keyof typeof prev].map((item: any) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  };

  return (
    <div className="min-h-screen flex w-full bg-[hsl(var(--background))]">
      <NavigationSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onSettingsOpen={() => setIsSettingsOpen(true)}
      />
      
      <ContentSidebar
        section={activeSection}
        items={currentItems}
        activeItem={activeItem}
        onItemSelect={setActiveItem}
        onItemAdd={handleItemAdd}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <MainPanel
        section={activeSection}
        activeItem={activeItem}
        items={currentItems}
        onItemUpdate={handleItemUpdate}
      />
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={(newTheme) => setTheme(newTheme as any)}
      />
    </div>
  );
}