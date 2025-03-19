
import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FormDialogProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const FormDialog: React.FC<FormDialogProps> = ({
  isOpen,
  title,
  onClose,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
