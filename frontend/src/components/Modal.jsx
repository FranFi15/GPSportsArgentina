// components/Modal.js
import React from 'react';
import './Modal.css'; // Create a CSS file for the modal

const Modal = ({ onClose, children, className }) => {
  return (
    <div className={`modal-overlay ${className}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;