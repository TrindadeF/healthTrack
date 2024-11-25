import React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  title?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  message?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  children,
  isOpen,
  onClose,
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar Modal"
        >
          &times;
        </button>

        {title && (
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
        )}
        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
