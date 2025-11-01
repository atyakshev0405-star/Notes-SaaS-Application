import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';

const ErrorPage = ({ errorCode = 404, message, onGoHome }) => {
  const getErrorContent = () => {
    switch (errorCode) {
      case 403:
        return {
          title: 'Access Denied',
          description: 'You don\'t have permission to access this page.',
          icon: AlertTriangle,
          iconColor: 'text-red-500'
        };
      case 404:
      default:
        return {
          title: 'Page Not Found',
          description: 'The page you\'re looking for doesn\'t exist.',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500'
        };
    }
  };

  const { title, description, icon: Icon, iconColor } = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className={`mx-auto w-24 h-24 ${iconColor} mb-8`}>
          <Icon className="w-full h-full" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">{errorCode}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {message || description}
        </p>
        <button
          onClick={onGoHome}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
