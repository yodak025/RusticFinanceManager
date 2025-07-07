import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import MovementRow from './MovementRow';
import NewMovementForm from './NewMovementForm';
import { type Movement } from "@/types/movementTypes";

interface MovementsTableContentProps {
  table: any; // Tipo de react-table
  onDeleteMovement: (index: number) => void;
  onAddMovement: (movement: Movement) => void;
  expireSession: () => void;
}

/**
 * Componente que maneja el contenido principal de la tabla de movimientos
 * Incluye la lista de movimientos existentes y el formulario para crear nuevos
 */
const MovementsTableContent: React.FC<MovementsTableContentProps> = ({
  table,
  onDeleteMovement,
  onAddMovement,
  expireSession
}) => {
  // Obtener el número total de columnas para el colspan en caso de tabla vacía
  const totalColumns = table.getAllColumns().length + 1; // +1 por la columna de acciones

  return (
    <>
      {/* Renderizar filas de movimientos existentes */}
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: any) => (
          <MovementRow
            key={row.id}
            row={row}
            onDeleteMovement={onDeleteMovement}
          />
        ))
      ) : (
        // Mostrar mensaje cuando no hay movimientos
        <TableRow>
          <TableCell colSpan={totalColumns} className="h-24 text-center text-gray-500">
            No hay movimientos registrados. ¡Crea tu primer movimiento!
          </TableCell>
        </TableRow>
      )}
      
      {/* Formulario para crear nuevos movimientos */}
      <NewMovementForm
        onCreateMovement={onAddMovement}
        onExpiredSession={expireSession}
      />
    </>
  );
};

export default MovementsTableContent;
