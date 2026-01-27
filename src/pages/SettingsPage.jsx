import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteUser } from '../api/users';
import { Trash2, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await deleteUser(user.id);
      // Logout and redirect handled by AuthContext cleanup usually, 
      // but we call logout explicitly to clear local state.
      logout();
    } catch (err) {
      console.error("Failed to delete account:", err);
      setError(err.response?.data?.error || "Failed to delete account. Please try again.");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

      <div className="bg-surface-light rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-text-muted text-sm mb-1">Name</label>
            <div className="text-white p-3 bg-black/20 rounded-lg">{user?.name}</div>
          </div>
          <div>
            <label className="block text-text-muted text-sm mb-1">Email</label>
            <div className="text-white p-3 bg-black/20 rounded-lg">{user?.email}</div>
          </div>
          <div>
            <label className="block text-text-muted text-sm mb-1">Role</label>
            <div className="text-white capitalize p-3 bg-black/20 rounded-lg">{user?.role?.replace('_', ' ')}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-red-500/5 rounded-2xl p-6 border border-red-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
            <Trash2 size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Danger Zone</h2>
            <p className="text-text-muted mb-6">
              Deleting your account is permanent and cannot be undone. All your data will be wiped immediately.
            </p>

            {!showConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowConfirm(true)}
                className="!bg-red-500 hover:!bg-red-600 text-white"
              >
                Delete Account
              </Button>
            ) : (
              <div className="bg-black/40 p-4 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-2 text-amber-400 mb-4 font-semibold">
                  <AlertTriangle size={20} />
                  <span>Are you sure you want to delete your account?</span>
                </div>
                {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    className="!bg-red-500 hover:!bg-red-600"
                  >
                    Yes, Delete My Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
