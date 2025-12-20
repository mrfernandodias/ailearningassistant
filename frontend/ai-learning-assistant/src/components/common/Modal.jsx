import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    // Focus close button on open for keyboard users
    closeBtnRef.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            <X className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
          </button>
          <div className="mb-6 pr-8">
            <h3
              id="modal-title"
              className="text-xl font-medium text-slate-900 tracking-tight"
            >
              {title}
            </h3>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
