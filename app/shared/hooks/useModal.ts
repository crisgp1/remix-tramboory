import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export function useModal(initialState: boolean = false) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: initialState,
    data: null
  });

  const openModal = useCallback((data?: any) => {
    setModalState({
      isOpen: true,
      data
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      data: null
    });
  }, []);

  const toggleModal = useCallback((data?: any) => {
    setModalState(prev => ({
      isOpen: !prev.isOpen,
      data: prev.isOpen ? null : data
    }));
  }, []);

  return {
    isOpen: modalState.isOpen,
    data: modalState.data,
    openModal,
    closeModal,
    toggleModal
  };
}

// Hook especializado para modales de confirmación
export function useConfirmModal() {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'warning' | 'danger' | 'info';
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning'
  });

  const showConfirm = useCallback((params: {
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'warning' | 'danger' | 'info';
    confirmText?: string;
    cancelText?: string;
  }) => {
    setConfirmState({
      isOpen: true,
      ...params,
      variant: params.variant || 'warning'
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  return {
    ...confirmState,
    showConfirm,
    hideConfirm
  };
}

// Hook para modales de información
export function useInfoModal() {
  const [infoState, setInfoState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant?: 'success' | 'warning' | 'danger' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info'
  });

  const showInfo = useCallback((params: {
    title: string;
    message: string;
    variant?: 'success' | 'warning' | 'danger' | 'info';
  }) => {
    setInfoState({
      isOpen: true,
      ...params,
      variant: params.variant || 'info'
    });
  }, []);

  const hideInfo = useCallback(() => {
    setInfoState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  return {
    ...infoState,
    showInfo,
    hideInfo
  };
}