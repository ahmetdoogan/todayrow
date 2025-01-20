import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'; // Doğru yol

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2>Welcome to Pro!</h2>
        </DialogHeader>
        <div className="p-6 text-center">
          <p className="text-lg mb-4">
            Thank you for upgrading! You now have access to all pro features.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Using Pro
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};