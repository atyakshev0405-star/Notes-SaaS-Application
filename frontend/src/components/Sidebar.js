import React from 'react';
import { Home, FileText, Settings, Users, FileText as AllNotes, Cog } from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, userRole }) => {
  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notes', label: 'My Notes', icon: FileText },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'notes', label: 'My Notes', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'all-notes', label: 'All Notes', icon: AllNotes },
    { id: 'settings', label: 'Settings', icon: Cog },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <nav className="flex items-center space-x-1 py-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Sidebar;
