import React, { useState } from 'react';
import { Plus, Calendar, Flag, MoreHorizontal, Check, CheckSquare, Trash2, Edit2, GripVertical } from 'lucide-react';
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

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  notes?: string;
}

interface TodoPanelProps {
  item: {
    id: string;
    name: string;
    todos: TodoItem[];
  };
  onUpdate: (itemId: string, updates: any) => void;
}

const priorityColors = {
  low: 'text-[hsl(var(--success))]',
  medium: 'text-[hsl(var(--warning))]',
  high: 'text-[hsl(var(--error))]',
};

function SortableTodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  onEditTitle, 
  isEditing, 
  editingText, 
  setEditingText, 
  setIsEditing 
}: {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEditTitle: (id: string, newText: string) => void;
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
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveEdit = () => {
    if (editingText.trim()) {
      onEditTitle(todo.id, editingText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`content-card flex items-start gap-4 group hover:border-[hsl(var(--dashboard-accent))] transition-colors ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
      >
        <GripVertical size={16} />
      </div>
      
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-[hsl(var(--success))] border-[hsl(var(--success))] text-white'
            : 'border-[hsl(var(--border-primary))] hover:border-[hsl(var(--dashboard-accent))]'
        }`}
      >
        {todo.completed && <Check size={12} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
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
            <span className={`text-[hsl(var(--text-primary))] ${
              todo.completed ? 'line-through' : ''
            }`}>
              {todo.text}
            </span>
          )}
          <Flag size={14} className={priorityColors[todo.priority]} />
        </div>
        
        {todo.dueDate && (
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--text-secondary))]">
            <Calendar size={12} />
            <span>Due {todo.dueDate}</span>
          </div>
        )}
        
        {todo.notes && (
          <p className="text-sm text-[hsl(var(--text-secondary))] mt-2">
            {todo.notes}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
        >
          <Edit2 size={14} />
        </button>
        <button 
          onClick={() => onDelete(todo.id)}
          className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--error))] transition-colors"
        >
          <Trash2 size={14} />
        </button>
        <button className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}

export function TodoPanel({ item, onUpdate }: TodoPanelProps) {
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        priority: 'medium',
      };
      
      onUpdate(item.id, {
        todos: [...item.todos, todo]
      });
      
      setNewTodo('');
      setIsAdding(false);
    }
  };

  const toggleTodo = (todoId: string) => {
    const updatedTodos = item.todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    onUpdate(item.id, { todos: updatedTodos });
  };

  const deleteTodo = (todoId: string) => {
    const updatedTodos = item.todos.filter(todo => todo.id !== todoId);
    onUpdate(item.id, { todos: updatedTodos });
  };

  const editTodoTitle = (todoId: string, newText: string) => {
    const updatedTodos = item.todos.map(todo =>
      todo.id === todoId ? { ...todo, text: newText } : todo
    );
    onUpdate(item.id, { todos: updatedTodos });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = item.todos.findIndex(todo => todo.id === active.id);
      const newIndex = item.todos.findIndex(todo => todo.id === over.id);
      
      const newTodos = arrayMove(item.todos, oldIndex, newIndex);
      onUpdate(item.id, { todos: newTodos });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTodo('');
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
              {item.todos.filter(t => !t.completed).length} of {item.todos.length} tasks remaining
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Add new task
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto dashboard-scroll">
        <div className="max-w-4xl space-y-3">
          {/* Add new todo */}
          {isAdding && (
            <div className="content-card border-dashed border-2 border-[hsl(var(--dashboard-accent))]">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={() => {
                  if (!newTodo.trim()) {
                    setIsAdding(false);
                  }
                }}
                placeholder="What needs to be done?"
                className="dashboard-input w-full"
                autoFocus
              />
            </div>
          )}

          {/* Todo items */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={item.todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
              {item.todos.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEditTitle={editTodoTitle}
                  isEditing={editingId === todo.id}
                  editingText={editingText}
                  setEditingText={setEditingText}
                  setIsEditing={(editing) => {
                    if (editing) {
                      setEditingId(todo.id);
                      setEditingText(todo.text);
                    } else {
                      setEditingId(null);
                      setEditingText('');
                    }
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {item.todos.length === 0 && !isAdding && (
            <div className="text-center py-12 text-[hsl(var(--text-secondary))]">
              <CheckSquare size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-sm">Add your first task to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}