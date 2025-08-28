import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Tag, Clock } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: string;
}

interface NotesPanelProps {
  item: Note;
  onUpdate: (itemId: string, updates: any) => void;
}

export function NotesPanel({ item, onUpdate }: NotesPanelProps) {
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);
  const [editTags, setEditTags] = useState((item.tags || []).join(', '));
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const saveNote = useCallback(() => {
    const tagsArray = editTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    setIsSaving(true);
    
    // Simulate save delay
    setTimeout(() => {
      onUpdate(item.id, {
        title: editTitle,
        content: editContent,
        tags: tagsArray,
        lastModified: new Date().toLocaleDateString()
      });
      setIsSaving(false);
    }, 500);
  }, [item.id, editTitle, editContent, editTags, onUpdate]);

  const debouncedSave = useCallback(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    const timeout = setTimeout(() => {
      saveNote();
    }, 2000);
    
    setSaveTimeout(timeout);
  }, [saveNote, saveTimeout]);

  useEffect(() => {
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditTags((item.tags || []).join(', '));
  }, [item]);

  const handleContentChange = (value: string) => {
    setEditContent(value);
    debouncedSave();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
    debouncedSave();
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTags(e.target.value);
    debouncedSave();
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border-primary))] p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <input
              value={editTitle}
              onChange={handleTitleChange}
              className="text-2xl font-semibold bg-transparent border-none outline-none text-[hsl(var(--text-primary))] w-full placeholder:text-[hsl(var(--text-secondary))]"
              placeholder="Note title..."
            />
            <div className="flex items-center gap-4 mt-2 text-sm text-[hsl(var(--text-secondary))]">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{item.lastModified}</span>
              </div>
              {(item.tags || []).length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  <span>{(item.tags || []).join(', ')}</span>
                </div>
              )}
              {isSaving && (
                <div className="flex items-center gap-1 text-[hsl(var(--primary))]">
                  <Clock size={14} className="animate-spin" />
                  <span>Saving...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-[hsl(var(--text-primary))] mb-2">
            Tags (comma-separated)
          </label>
          <input
            value={editTags}
            onChange={handleTagsChange}
            className="dashboard-input w-full"
            placeholder="tag1, tag2, tag3"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 relative">
        <ReactQuill
          value={editContent}
          onChange={handleContentChange}
          modules={quillModules}
          theme="snow"
          className="h-full"
          style={{
            height: 'calc(100% - 42px)',
            '--quill-border-color': 'hsl(var(--border-primary))',
            '--quill-text-color': 'hsl(var(--text-primary))',
            '--quill-bg-color': 'hsl(var(--background-primary))',
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}