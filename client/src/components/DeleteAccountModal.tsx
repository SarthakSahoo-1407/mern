import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
  const { token, logout } = useAuth();

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:3000/api/auth/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Delete Account</h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;