import React from 'react';
import { Edit, Trash2, Lock, Globe, Users } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete, isEditing, editForm, onSaveEdit, onCancelEdit }) => {
  const getAccessIcon = (level) => {
    switch (level) {
      case 'private': return <Lock className="w-4 h-4" />;
      case 'public': return <Globe className="w-4 h-4" />;
      case 'shared': return <Users className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (level) => {
    switch (level) {
      case 'private': return 'text-red-600';
      case 'public': return 'text-green-600';
      case 'shared': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="card p-6">
      {isEditing ? (
        <form onSubmit={onSaveEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => editForm.setTitle(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={editForm.content}
              onChange={(e) => editForm.setContent(e.target.value)}
              rows="3"
              className="input-field w-full resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
            <select
              value={editForm.accessLevel}
              onChange={(e) => editForm.setAccessLevel(e.target.value)}
              className="input-field w-full"
            >
              <option value="private">🔒 Private</option>
              <option value="public">🌍 Public</option>
              <option value="shared">🤝 Shared</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
            <button type="button" onClick={onCancelEdit} className="btn-danger">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">{note.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(note)}
                className="text-gray-600 hover:text-blue-600 p-1"
                title="Edit note"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="text-gray-600 hover:text-red-600 p-1"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">{note.content}</p>
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium flex items-center space-x-1 ${getStatusColor(note.access_level)}`}>
              {getAccessIcon(note.access_level)}
              <span className="capitalize">{note.access_level}</span>
            </span>
            <span className="text-sm text-gray-500">{new Date(note.created_at).toLocaleDateString()}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteCard;
