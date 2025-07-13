import { create } from 'zustand';
import { type Alert, AlertType } from '@/types/alertTypes';

interface AlertStore {
  alerts: Alert[];
  addAlert: (type: AlertType, content: string) => void;
  removeAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alerts: [],
  
  addAlert: (type: AlertType, content: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newAlert: Alert = { id, type, content };
    
    set((state) => ({
      alerts: [...state.alerts, newAlert]
    }));

    // Auto-remove alert after 3 seconds
  },
  
  removeAlert: (id: string) => {
    set((state) => ({
      alerts: state.alerts.filter(alert => alert.id !== id)
    }));
  },
  
  clearAllAlerts: () => {
    set({ alerts: [] });
  },
}));
