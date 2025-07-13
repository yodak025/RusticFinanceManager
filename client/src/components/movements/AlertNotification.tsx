import React from 'react';
import { useAlertStore } from '@/store/useAlertStore';
import { AlertType, type Alert } from '@/types/alertTypes';

/**
 * Componente interno para mostrar notificaciones de éxito
 */
const MessageAlert: React.FC<{ alert: Alert; onClose: () => void }> = ({ alert, onClose }) => (
  <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-lg w-full min-h-[50px]">
    <span className="flex-1 mr-2">{alert.content}</span>
    <button 
      onClick={onClose} 
      className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors font-bold text-lg leading-none"
    >
      ×
    </button>
  </div>
);

/**
 * Componente interno para mostrar notificaciones de error
 */
const ErrorAlert: React.FC<{ alert: Alert; onClose: () => void }> = ({ alert, onClose }) => (
  <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-lg w-full min-h-[50px]">
    <span className="flex-1 mr-2">{alert.content}</span>
    <button 
      onClick={onClose} 
      className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors font-bold text-lg leading-none"
    >
      ×
    </button>
  </div>
);

/**
 * Componente para mostrar notificaciones múltiples de éxito y error
 * Se posiciona de forma fija en la esquina superior derecha de la pantalla
 * Maneja múltiples notificaciones apiladas verticalmente
 */
const AlertNotification: React.FC = () => {
  const { alerts, removeAlert } = useAlertStore();

  const handleClose = (alertId: string) => {
    removeAlert(alertId);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 min-w-64 max-w-96">
      {alerts.map((alert) => {
        if (alert.type === AlertType.MESSAGE) {
          return (
            <MessageAlert 
              key={alert.id} 
              alert={alert} 
              onClose={() => handleClose(alert.id)} 
            />
          );
        } else if (alert.type === AlertType.ERROR) {
          return (
            <ErrorAlert 
              key={alert.id} 
              alert={alert} 
              onClose={() => handleClose(alert.id)} 
            />
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default AlertNotification;
