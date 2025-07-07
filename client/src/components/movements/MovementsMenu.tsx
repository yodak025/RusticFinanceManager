import { useState } from "react";
import { type Movement } from "@/types/movementTypes";
import useFetchMovements, { fetchDeleteMovement } from "@/hooks/movementsFetching";
import BaseTable from "../tables/BaseTable";
import MovementsTableContent from "./MovementsTableContent";
import LoadingState from "./LoadingState";
import { movementColumns } from "./movementColumns";

interface MovementsMenuProps {
  expireSession: () => void;
}

/**
 * Componente principal del menú de movimientos financieros
 * Gestiona el estado global de los movimientos y coordina las operaciones CRUD
 */
export default function MovementsMenu({ expireSession }: MovementsMenuProps) {
  // Estado para almacenar la lista de movimientos obtenidos del servidor
  const [movements, setMovements] = useState<Movement[] | null>(null);

  /**
   * Elimina un movimiento específico de la lista local y del servidor
   * @param index - Índice del movimiento en la lista local
   */
  const deleteMovement = (index: number) => {
    if (!movements) return;
    
    // Filtrar el movimiento de la lista local para actualización inmediata de UI
    const updatedMovements = movements.filter((_, i) => i !== index);
    setMovements(updatedMovements);
    
    // Enviar petición al servidor para eliminar el movimiento
    fetchDeleteMovement(movements[index].id, expireSession);
  };

  /**
   * Añade un nuevo movimiento a la lista local
   * @param movement - Nuevo movimiento a añadir
   */
  const addMovement = (movement: Movement) => {
    setMovements(current => current ? [...current, movement] : [movement]);
  };

  // Hook personalizado para obtener los movimientos del servidor al montar el componente
  useFetchMovements(setMovements, expireSession);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Movimientos</h2>
      
      {/* Mostrar estado de carga mientras se obtienen los datos */}
      {!movements ? (
        <LoadingState />
      ) : (
        /* Tabla principal con los movimientos y funcionalidad de gestión */
        <BaseTable data={movements} columns={movementColumns}>
          {(table: any) => (
            <MovementsTableContent
              table={table}
              onDeleteMovement={deleteMovement}
              onAddMovement={addMovement}
              expireSession={expireSession}
            />
          )}
        </BaseTable>
      )}
    </div>
  );
}
