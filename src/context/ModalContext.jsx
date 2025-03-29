// context/ModalContext.jsx
import React, { createContext, useContext, useState } from 'react'; // Add React import
import Modal from '../components/Modal'; // Ensure correct path

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        content: null,
        buttons: []
    });

    const showModal = (config) => {
        setModalState({
            isOpen: true,
            title: config.title,
            content: config.content,
            buttons: config.buttons || []
        });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {children}
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
                buttons={modalState.buttons}
            >
                {modalState.content}
            </Modal>
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
};