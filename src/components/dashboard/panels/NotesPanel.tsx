import React, { useState } from 'react';
import { Edit3, Calendar, Hash } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: string;
}

interface NotesPanelProps {
  item: {
    id: string;
    name: string;
    notes: Note[];
  };
  onUpdate: (itemId: string, updates: any) => void;
}

export function NotesPanel({ item, onUpdate }: NotesPanelProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(
    item.notes.length > 0 ? item.notes[0] : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const startEditing = (note: Note) => {
    setEditContent(note.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (selectedNote) {
      const updatedNotes = item.notes.map(note =>
        note.id === selectedNote.id
          ? { ...note, content: editContent, lastModified: new Date().toLocaleDateString() }
          : note
      );
      onUpdate(item.id, { notes: updatedNotes });
      setSelectedNote({ ...selectedNote, content: editContent });
      setIsEditing(false);
    }
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '# New Note\n\nStart writing here...',
      tags: [],
      lastModified: new Date().toLocaleDateString(),
    };
    
    const updatedNotes = [...item.notes, newNote];
    onUpdate(item.id, { notes: updatedNotes });
    setSelectedNote(newNote);
    setEditContent(newNote.content);
    setIsEditing(true);
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
              {selectedNote ? selectedNote.title : `${item.notes.length} notes`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedNote && (
              <button
                onClick={() => startEditing(selectedNote)}
                className="btn-ghost flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
            <button
              onClick={createNewNote}
              className="btn-primary"
            >
              New Note
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Notes List */}
        {item.notes.length > 1 && (
          <div className="w-80 border-r border-[hsl(var(--border-primary))] p-4 overflow-y-auto dashboard-scroll">
            <div className="space-y-2">
              {item.notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-[hsl(var(--hover-accent))] border border-[hsl(var(--dashboard-accent))]'
                      : 'hover:bg-[hsl(var(--hover-bg))]'
                  }`}
                >
                  <h3 className="font-medium text-[hsl(var(--text-primary))] truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--text-secondary))] line-clamp-2 mt-1">
                    {note.content.replace(/#+\s*/g, '').substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[hsl(var(--text-muted))]">
                    <Calendar size={12} />
                    <span>{note.lastModified}</span>
                    {note.tags.length > 0 && (
                      <>
                        <Hash size={12} />
                        <span>{note.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note Content */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <div className="flex-1 p-6">
              {isEditing ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={saveNote}
                      className="btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="dashboard-input flex-1 resize-none font-mono text-sm"
                    placeholder="Write your note in Markdown..."
                  />
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-[hsl(var(--text-primary))]">
                    {selectedNote.content}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-[hsl(var(--text-secondary))]">
                <Edit3 size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                <p className="text-sm">Create your first note to get started</p>
                <button
                  onClick={createNewNote}
                  className="btn-primary mt-4"
                >
                  Create Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}