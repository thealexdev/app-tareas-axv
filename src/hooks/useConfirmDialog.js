import { useState } from 'react';

const useConfirmDialog = () => {
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        description: '',
        variant: 'danger',
        confirmText: undefined,
        onConfirm: null,
    });

    const confirm = ({
        title,
        description,
        variant = 'danger',
        confirmText,
        onConfirm,
    }) => {
        setDialog({
            open: true,
            title,
            description,
            variant,
            confirmText,
            onConfirm,
        });
    };

    const close = () => setDialog(prev => ({ ...prev, open: false }));

    const handleConfirm = () => {
        dialog.onConfirm?.();
        close();
    };

    return { dialog, confirm, close, handleConfirm };
};

export default useConfirmDialog;
