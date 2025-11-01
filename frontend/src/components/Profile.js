import React, { useState } from 'react';
import { User, Mail, Key, Trash2 } from 'lucide-react';

const Profile = ({ user, onLogout, showNotification }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    // TODO: Implement password change API call
    showNotification('Password changed successfully');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    // TODO: Implement account deletion API call
    showNotification('Account deleted successfully');
    onLogout();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-gray-600 flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </p>
              <span className={user?.role === 'admin' ? 'badge-admin' : 'badge-user'}>
                {user?.role || 'user'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="input-field w-full bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="text"
                value={user?.password || ''}
                readOnly
                className="input-field w-full bg-gray-50"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={user?.role || 'user'}
                    readOnly
                    className="input-field w-full bg-gray-50"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn-primary flex items-center space-x-2 w-full justify-center"
              >
                <Key className="w-4 h-4" />
                <span>Change Password</span>
              </button>

              <button
                onClick={handleDeleteAccount}
                className="btn-danger flex items-center space-x-2 w-full justify-center"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field w-full"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="btn-primary flex-1">
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-danger flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
