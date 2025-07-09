import React, { useState } from 'react';
import { type Movement, MovementType } from "@/types/movementTypes";
import { fetchCreateMovement } from "@/hooks/movementsFetching";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface NewMovementFormProps {
  onCreateMovement: (movement: Movement) => void;
  onShowError: (message: string) => void;
  onExpiredSession: () => void;
}

/**
 * Componente de formulario para crear un nuevo movimiento financiero
 * Permite al usuario ingresar todos los datos necesarios y validar antes de enviar
 */
const NewMovementForm: React.FC<NewMovementFormProps> = ({
  onCreateMovement,
  onShowError,
  onExpiredSession
}) => {
  // Estado para controlar si el formulario está en modo de creación
  const [isCreating, setIsCreating] = useState(false);
  
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
    setMovement(prev => ({ ...prev, [field]: value }));
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
              <input
                type="text"
                value={movement.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Origen"
              />
            </TableCell>
            
            {/* Campo de destino */}
            <TableCell>
              <input
                type="text"
                value={movement.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Destino"
              />
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
