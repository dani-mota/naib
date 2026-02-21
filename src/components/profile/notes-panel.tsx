"use client";

import { useState } from "react";
import { MessageSquare, Pencil, Trash2, Send } from "lucide-react";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string };
}

interface NotesPanelProps {
  notes: Note[];
  candidateId: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function NotesPanel({ notes: initialNotes, candidateId }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!newContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/candidates/${candidateId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes([note, ...notes]);
        setNewContent("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes(notes.map((n) => (n.id === id ? updated : n)));
        setEditingId(null);
        setEditContent("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes(notes.filter((n) => n.id !== id));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Notes
            </h2>
          </div>
          <span className="text-[10px] font-mono font-medium text-muted-foreground px-2 py-0.5 bg-accent border border-border">
            {notes.length}
          </span>
        </div>
      </div>

      {/* Add note */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 bg-accent border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-naib-gold/50"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!newContent.trim() || submitting}
            className="self-end px-3 py-2 bg-naib-gold text-naib-navy text-[10px] font-semibold uppercase tracking-wider hover:bg-naib-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="p-5">
          <p className="text-xs text-muted-foreground">No notes yet. Add the first one above.</p>
        </div>
      ) : (
        <div>
          {notes.map((note) => (
            <div key={note.id} className="px-5 py-3 border-b border-border/50 last:border-b-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-foreground">{note.author.name}</span>
                  <span className="text-[9px] text-muted-foreground font-mono">{timeAgo(note.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingId(note.id);
                      setEditContent(note.content);
                    }}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 text-muted-foreground hover:text-naib-red transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {editingId === note.id ? (
                <div className="flex gap-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 bg-accent border border-border px-3 py-2 text-xs text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-naib-gold/50"
                    rows={2}
                  />
                  <div className="flex flex-col gap-1 self-end">
                    <button
                      onClick={() => handleEdit(note.id)}
                      disabled={!editContent.trim() || submitting}
                      className="px-2 py-1 bg-naib-gold text-naib-navy text-[9px] font-semibold uppercase hover:bg-naib-gold/90 transition-colors disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
