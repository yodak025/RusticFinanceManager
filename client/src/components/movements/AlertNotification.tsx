import React from 'react';

interface AlertNotificationProps {
  message?: string;
  error?: string;
  onClearMessage: () => void;
  onClearError: () => void;
}

/**
 * Componente para mostrar notificaciones de éxito y error de forma temporal
 * Se posiciona de forma fija en la esquina superior derecha de la pantalla
 */
const AlertNotification: React.FC<AlertNotificationProps> = ({
  message,
  error,
  onClearMessage,
  onClearError
}) => {
  return (
    <>
      {/* Notificación de éxito - aparece cuando una operación se completa correctamente */}
      {message && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-lg z-50">
          {message}
          <button 
            onClick={onClearMessage} 
            className="ml-2 text-green-600 hover:text-green-800 transition-colors"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Notificación de error - aparece cuando hay algún problema en la operación */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-lg z-50">
          {error}
          <button 
            onClick={onClearError} 
            className="ml-2 text-red-600 hover:text-red-800 transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default AlertNotification;
