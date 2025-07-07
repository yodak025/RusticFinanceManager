import React, { useState } from 'react';
import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteMovementButton from "./DeleteMovementButton";
import AlertNotification from "./AlertNotification";

interface MovementRowProps {
  row: any; // Tipo de react-table
  onDeleteMovement: (index: number) => void;
}

/**
 * Componente que representa una fila individual de movimiento en la tabla
 * Incluye todas las celdas con datos del movimiento y el botón de eliminar
 * Maneja las notificaciones de éxito y error al eliminar movimientos
 */
const MovementRow: React.FC<MovementRowProps> = ({ row, onDeleteMovement }) => {
  // Estado para manejar mensajes de notificación
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Maneja la eliminación del movimiento con notificaciones
   * Muestra mensaje de éxito o error según el resultado de la operación
   */
  const handleDeleteMovement = () => {
    try {
      onDeleteMovement(row.index);
      setSuccessMessage("Movimiento eliminado exitosamente");
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Error al eliminar el movimiento. Intenta nuevamente.");
      
      // Limpiar mensaje de error después de 3 segundos
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <>
      {/* Notificación de alertas para mostrar mensajes de éxito/error */}
      <AlertNotification
        message={successMessage}
        error={errorMessage}
        onClearMessage={() => setSuccessMessage("")}
        onClearError={() => setErrorMessage("")}
      />
      
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
        {/* Renderizar todas las celdas de datos del movimiento */}
        {row.getVisibleCells().map((cell: any) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
        
        {/* Celda adicional para el botón de eliminar movimiento */}
        <TableCell>
          <DeleteMovementButton
            onAccepted={handleDeleteMovement}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

export default MovementRow;
