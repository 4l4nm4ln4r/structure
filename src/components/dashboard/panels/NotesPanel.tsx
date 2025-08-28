import React, { useState } from 'react';
import { Edit3, Calendar, Tag, Save, X } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content);
  const [editTags, setEditTags] = useState((item.tags || []).join(', '));

  const startEditing = () => {
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditTags((item.tags || []).join(', '));
    setIsEditing(true);
  };

  const saveNote = () => {
    const tagsArray = editTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onUpdate(item.id, {
      title: editTitle,
      content: editContent,
      tags: tagsArray,
      lastModified: new Date().toLocaleDateString()
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditTags((item.tags || []).join(', '));
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border-primary))] p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-semibold bg-transparent border-none outline-none text-[hsl(var(--text-primary))] w-full"
                placeholder="Note title..."
              />
            ) : (
              <h1 className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
                {item.title}
              </h1>
            )}
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
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={saveNote}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="btn-ghost flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={startEditing}
                className="btn-ghost flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-[hsl(var(--text-primary))] mb-2">
              Tags (comma-separated)
            </label>
            <input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="dashboard-input w-full"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="dashboard-input w-full h-full resize-none font-mono text-sm"
            placeholder="Write your note in Markdown..."
          />
        ) : (
          <div className="prose prose-slate max-w-none h-full overflow-y-auto dashboard-scroll">
            <div className="whitespace-pre-wrap text-[hsl(var(--text-primary))] leading-relaxed">
              {item.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}