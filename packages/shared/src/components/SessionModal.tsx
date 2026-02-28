import React, { useState, useEffect } from 'react';
import type { Session, Project } from '../types';
import { todayStr, shortDate, fmt } from '../utils';
import { Modal } from './Modal';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { date: string; project: string; wordCount: number; note: string }) => void;
  onDelete?: (id: string) => void;
  session?: Session | null;
  projects: Project[];
  canAddProject: boolean;
  existingProjectNames: string[];
}

export function SessionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  session,
  projects,
  canAddProject,
  existingProjectNames,
}: SessionModalProps) {
  const isEdit = !!session;
  const [date, setDate] = useState(todayStr());
  const [project, setProject] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (session) {
        setDate(session.date);
        setProject(session.project);
        setWordCount(String(session.wordCount));
        setNote(session.note);
      } else {
        setDate(todayStr());
        setProject('');
        setWordCount('');
        setNote('');
      }
      setError('');
      setConfirmDelete(false);
    }
  }, [isOpen, session]);

  const handleSave = () => {
    const trimmedProject = project.trim();
    const wc = parseInt(wordCount, 10);
    if (!date) {
      setError('Date is required');
      return;
    }
    if (!trimmedProject) {
      setError('Project name is required');
      return;
    }
    if (!wordCount || isNaN(wc) || wc <= 0) {
      setError('Word count must be a positive number');
      return;
    }
    // Check if this would create a new project beyond limit
    const isNewProject = !existingProjectNames.some(
      n => n.toLowerCase() === trimmedProject.toLowerCase()
    );
    if (isNewProject && !canAddProject) {
      setError('Free tier limit reached: maximum 3 projects. Remove a project or upgrade to add more.');
      return;
    }
    setError('');
    onSave({ date, project: trimmedProject, wordCount: wc, note: note.trim() });
  };

  if (confirmDelete && session) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="modal-confirm-delete">
          <h3 className="modal-title">Delete this session?</h3>
          <div className="modal-delete-summary">
            <div><strong>Date:</strong> {shortDate(session.date)}</div>
            <div><strong>Project:</strong> {session.project}</div>
            <div><strong>Words:</strong> {fmt(session.wordCount)}</div>
            {session.note && <div><strong>Note:</strong> {session.note}</div>}
          </div>
          <p className="modal-delete-warn">This action cannot be undone.</p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button
              className="btn btn-danger"
              onClick={() => {
                onDelete?.(session.id);
                onClose();
              }}
            >
              Yes, delete it
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{isEdit ? 'Edit Session' : 'New Session'}</h3>

      <div className="modal-form">
        <label className="modal-label">
          Date
          <input
            type="date"
            className="modal-input"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>

        <label className="modal-label">
          Project
          {isEdit && existingProjectNames.length > 0 ? (
            <select
              className="modal-input"
              value={project}
              onChange={e => setProject(e.target.value)}
            >
              {existingProjectNames.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          ) : (
            <>
              <input
                type="text"
                className="modal-input"
                list="project-datalist"
                value={project}
                onChange={e => setProject(e.target.value)}
                placeholder="Project name..."
              />
              <datalist id="project-datalist">
                {existingProjectNames.map(n => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </>
          )}
        </label>

        <label className="modal-label">
          Word Count
          <input
            type="number"
            className="modal-input"
            value={wordCount}
            onChange={e => setWordCount(e.target.value)}
            min={1}
            placeholder="How many words?"
          />
        </label>

        <label className="modal-label">
          Note (optional)
          <textarea
            className="modal-textarea"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Any notes about this session..."
            rows={3}
          />
        </label>

        {error && <div className="modal-error">{error}</div>}
      </div>

      <div className="modal-actions">
        {isEdit && onDelete && (
          <button
            className="btn btn-danger-outline modal-delete-btn"
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </button>
        )}
        <div className="modal-actions-right">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Save Session'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
