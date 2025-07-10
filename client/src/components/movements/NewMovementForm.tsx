import React, { useState } from 'react';
import { type Movement, MovementType } from "@/types/movementTypes";
import { fetchCreateMovement } from "@/hooks/movementsFetching";
import { useFetchAccounts } from "@/hooks/accountsFetching";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface NewMovementFormProps {
  onCreateMovement: (movement: Movement) => void;
  onShowError: (message: string) => void;
  onExpiredSession: () => void;
  newAccount: {
    isNewAccount: boolean;
    setIsNewAccount: (value: boolean) => void;
  };
}

/**
 * Componente de formulario para crear un nuevo movimiento financiero
 * Permite al usuario ingresar todos los datos necesarios y validar antes de enviar
 */
const NewMovementForm: React.FC<NewMovementFormProps> = ({
  onCreateMovement,
  onShowError,
  onExpiredSession,
  newAccount
}) => {
  // Estado para controlar si el formulario está en modo de creación
  const [isCreating, setIsCreating] = useState(false);
  const { isNewAccount, setIsNewAccount }  = newAccount 
  
  // Hook para obtener las cuentas del usuario
  const accounts = useFetchAccounts(onExpiredSession, isNewAccount, setIsNewAccount);
  
  // Estados para almacenar los datos del movimiento que se está creando
  const [movement, setMovement] = useState<Movement>({
    amount: 0,
    origin: '',
    destination: '',
    type: MovementType.INCOME,
    date: '',
    description: '',
    tags: [],
    id: -1
  });

  /**
   * Maneja los cambios en los campos del formulario
   * Actualiza el estado del movimiento de forma inmutable
   */
  const handleInputChange = (field: keyof Movement, value: any) => {
    setMovement(prev => {
      const updated = { ...prev, [field]: value };
      
      // Si se cambia el tipo de movimiento, limpiar campos que se deshabilitarán
      if (field === 'type') {
        if (value === MovementType.EXPENSE) {
          // Para gastos, limpiar el origen
          updated.origin = '';
        } else if (value === MovementType.INCOME) {
          // Para ingresos, limpiar el destino
          updated.destination = '';
        }
      }
      
      return updated;
    });
  };

  /**
   * Resetea el formulario a su estado inicial
   * Útil después de crear un movimiento o cancelar la operación
   */
  const resetForm = () => {
    setMovement({
      amount: 0,
      origin: '',
      destination: '',
      type: MovementType.INCOME,
      date: '',
      description: '',
      tags: [],
      id: -1
    });
    setIsCreating(false);
  };

  /**
   * Envía la petición para crear un nuevo movimiento
   * Maneja la respuesta y actualiza las notificaciones correspondientes
   */
  const createMovement = async () => {
    try {
      await fetchCreateMovement(movement, onExpiredSession);
      onCreateMovement(movement);
      resetForm();
    } catch (err) {
      onShowError('Error creando movimiento');
    }
  };

  /**
   * Convierte una cadena de tags separadas por comas en un array
   * Elimina espacios en blanco y entradas vacías
   */
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  /**
   * Determina si el campo origen debe estar deshabilitado
   * Se deshabilita para gastos ya que el origen es implícito (usuario)
   */
  const isOriginDisabled = () => {
    return movement.type === MovementType.EXPENSE;
  };

  /**
   * Determina si el campo destino debe estar deshabilitado
   * Se deshabilita para ingresos ya que el destino es implícito (usuario)
   */
  const isDestinationDisabled = () => {
    return movement.type === MovementType.INCOME;
  };

  return (
    <TableRow>
      {isCreating ? (
        // Modo de creación: mostrar formulario completo
        <>
            {/* Campo de fecha */}
            <TableCell>
              <input
                type="date"
                value={movement.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </TableCell>
            
            {/* Selector de tipo de movimiento */}
            <TableCell>
              <select
                value={movement.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(MovementType).map((type: string) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </TableCell>
            
            {/* Campo de cantidad */}
            <TableCell>
              <input
                type="number"
                step="0.01"
                value={movement.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </TableCell>
            
            {/* Campo de descripción */}
            <TableCell>
              <input
              type="text"
              value={movement.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción"
              />
            </TableCell>
            
            {/* Campo de origen */}
            <TableCell>
              <select
              value={movement.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              disabled={isOriginDisabled()}
              className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                isOriginDisabled() ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
              }`}
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
              <option value="">
                {isOriginDisabled() ? 'N/A (Gasto)' : 'Seleccionar origen'}
              </option>
              {!isOriginDisabled() && accounts?.map((account, index) => (
                <option key={index} value={account.name}>
                {account.name}
                </option>
              ))}
              </select>
            </TableCell>
            
            {/* Campo de destino */}
            <TableCell>
              <select
              value={movement.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              disabled={isDestinationDisabled()}
              className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                isDestinationDisabled() ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
              }`}
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
              <option value="">
                {isDestinationDisabled() ? 'N/A (Ingreso)' : 'Seleccionar destino'}
              </option>
              {!isDestinationDisabled() && accounts?.map((account, index) => (
                <option key={index} value={account.name}>
                {account.name}
                </option>
              ))}
              </select>
            </TableCell>
            
            {/* Campo de etiquetas */}
            <TableCell>
              <input
                type="text"
                value={movement.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tags (separadas por comas)"
              />
            </TableCell>
            
            {/* Botones de acción */}
            <TableCell>
              <Button onClick={createMovement} className="mr-2">
                Crear Movimiento
              </Button>
              <Button
                variant="destructive"
                onClick={resetForm}
              >
                🗑️
              </Button>
            </TableCell>
          </>
        ) : (
          // Modo compacto: mostrar solo botón para activar el formulario
          <TableCell colSpan={8} className="text-center p-4">
            <Button
              onClick={() => setIsCreating(true)}
              className="text-white font-bold py-2 px-4 text-3xl rounded-full shadow-lg transition-colors duration-200 hover:shadow-xl"
            >
              +
            </Button>
          </TableCell>
        )}
      </TableRow>
    );
  };

  export default NewMovementForm;
