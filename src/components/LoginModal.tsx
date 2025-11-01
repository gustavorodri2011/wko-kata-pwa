import { useState } from 'react';
import { X, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { users, login } = useAppStore();
  const [selectedUserId, setSelectedUserId] = useState('');

  if (!isOpen) return null;

  const handleLogin = () => {
    if (selectedUserId) {
      login(selectedUserId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Iniciar Sesión
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay usuarios registrados. Contacta al administrador.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar Usuario
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Selecciona tu usuario...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.belt}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLogin}
              disabled={!selectedUserId}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};