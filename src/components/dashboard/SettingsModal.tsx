import React from 'react';
import { X, Monitor, Moon, Sun } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

export function SettingsModal({ isOpen, onClose, theme, onThemeChange }: SettingsModalProps) {
  const themeOptions = [
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[hsl(var(--panel-main))] border-[hsl(var(--border-primary))]">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--text-primary))]">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Theme Settings */}
          <div>
            <h3 className="text-sm font-medium text-[hsl(var(--text-primary))] mb-3">
              Appearance
            </h3>
            <div className="space-y-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => onThemeChange(option.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors border ${
                      theme === option.id
                        ? 'bg-[hsl(var(--hover-accent))] text-[hsl(var(--dashboard-accent))] border-[hsl(var(--dashboard-accent))]'
                        : 'hover:bg-[hsl(var(--hover-bg))] text-[hsl(var(--text-primary))] border-[hsl(var(--border-primary))]'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{option.label}</span>
                    {theme === option.id && (
                      <div className="ml-auto w-2 h-2 bg-[hsl(var(--dashboard-accent))] rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* App Info */}
          <div className="border-t border-[hsl(var(--border-primary))] pt-4">
            <h3 className="text-sm font-medium text-[hsl(var(--text-primary))] mb-3">
              About
            </h3>
            <div className="text-sm text-[hsl(var(--text-secondary))] space-y-1">
              <p>Personal Dashboard v1.0</p>
              <p>Built with React & Tailwind CSS</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}