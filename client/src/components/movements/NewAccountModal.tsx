import React, { useState } from 'react';
import { Button } from "../ui/button";
import { fetchCreateAccount } from "@/hooks/accountsFetching";

interface NewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: () => void;
  onShowError: (message: string) => void;
  onShowSuccess: (message: string) => void;
}

/**
 * Modal para crear una nueva cuenta financiera
 * Permite al usuario ingresar el nombre y saldo inicial de una nueva cuenta
 */
const NewAccountModal: React.FC<NewAccountModalProps> = ({
  isOpen,
  onClose,
  onAccountCreated,
  onShowError,
  onShowSuccess
}) => {
  // Estados para los datos de la nueva cuenta
  const [accountName, setAccountName] = useState('');
  const [initialAmount, setInitialAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = () => {
    setAccountName('');
    setInitialAmount(0);
    setIsLoading(false);
  };

  /**
   * Maneja el cierre del modal
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /**
   * Valida los datos del formulario
   */
  const validateForm = () => {
    if (!accountName.trim()) {
      onShowError('El nombre de la cuenta es obligatorio');
      return false;
    }
    if (accountName.trim().length < 2) {
      onShowError('El nombre de la cuenta debe tener al menos 2 caracteres');
      return false;
    }
    if (isNaN(initialAmount)) {
      onShowError('El saldo inicial debe ser un número válido');
      return false;
    }
    return true;
  };

  /**
   * Envía la petición para crear la nueva cuenta
   */
  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await fetchCreateAccount(
        { 
          name: accountName.trim(), 
          amount: initialAmount 
        }
      );
      
      onShowSuccess('Cuenta creada exitosamente');
      onAccountCreated();
      handleClose();
    } catch (error) {
      onShowError('Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja el envío del formulario al presionar Enter
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCreateAccount();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Encabezado del modal */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Nueva Cuenta
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          {/* Campo de nombre */}
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la cuenta *
            </label>
            <input
              id="accountName"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Cuenta de Ahorros"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Campo de saldo inicial */}
          <div>
            <label htmlFor="initialAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Saldo inicial
            </label>
            <input
              id="initialAmount"
              type="number"
              step="0.01"
              value={initialAmount}
              onChange={(e) => setInitialAmount(parseFloat(e.target.value) || 0)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateAccount}
            disabled={isLoading || !accountName.trim()}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAccountModal;
