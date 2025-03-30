// components/Modal.jsx
import React, { useEffect } from 'react'; // Ensure React is imported
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, buttons }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-[#0000009e] bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4">
                    {children}
                </div>

                {buttons && (
                    <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                        {buttons.map((button, index) => (
                            <button
                                key={index}
                                onClick={button.onClick}
                                className={`px-4 py-2 rounded ${button.className}`}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;