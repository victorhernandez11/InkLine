import React from 'react';
import { Modal } from './Modal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, count }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width={420}>
      <h3 className="modal-title">Delete {count} session{count !== 1 ? 's' : ''}?</h3>
      <p className="modal-delete-warn">
        You are about to delete {count} session{count !== 1 ? 's' : ''}. This action cannot be undone.
      </p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>
          Yes, delete all {count}
        </button>
      </div>
    </Modal>
  );
}
