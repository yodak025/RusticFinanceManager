import React from 'react';
import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/components/ui/table";
import DeleteMovementButton from "./DeleteMovementButton";

interface MovementRowProps {
  row: any; // Tipo de react-table
  onDeleteMovement: (index: number) => void;
}

/**
 * Componente que representa una fila individual de movimiento en la tabla
 * Incluye todas las celdas con datos del movimiento y el botón de eliminar
 */
const MovementRow: React.FC<MovementRowProps> = ({ row, onDeleteMovement }) => {
  /**
   * Maneja la eliminación del movimiento
   * La gestión de notificaciones se realiza a nivel superior en MovementsMenu
   */
  const handleDeleteMovement = () => {
    onDeleteMovement(row.index);
  };

  return (
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
  );
};

export default MovementRow;
