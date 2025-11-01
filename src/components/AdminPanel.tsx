import { useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { BeltLevel } from '../types';
import { BELT_HIERARCHY } from '../utils/beltHierarchy';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const { users, addUser, removeUser, updateUser } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', belt: '' as BeltLevel });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.belt) {
      if (editingUser) {
        updateUser(editingUser, formData);
        setEditingUser(null);
      } else {
        addUser(formData);
      }
      setFormData({ name: '', belt: '' as BeltLevel });
      setShowAddForm(false);
    }
  };

  const handleEdit = (user: any) => {
    setFormData({ name: user.name, belt: user.belt });
    setEditingUser(user.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', belt: '' as BeltLevel });
    setEditingUser(null);
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Panel de Administración
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {!showAddForm ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Usuarios ({users.length})
              </h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                Agregar Usuario
              </button>
            </div>

            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.belt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => removeUser(user.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cinturón
              </label>
              <select
                value={formData.belt}
                onChange={(e) => setFormData({ ...formData, belt: e.target.value as BeltLevel })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Seleccionar cinturón...</option>
                {BELT_HIERARCHY.map((belt) => (
                  <option key={belt} value={belt}>
                    {belt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg"
              >
                {editingUser ? 'Actualizar' : 'Agregar'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};