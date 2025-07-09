import { useState } from "react";
import { type Movement } from "@/types/movementTypes";
import useFetchMovements, { fetchDeleteMovement } from "@/hooks/movementsFetching";
import BaseTable from "../tables/BaseTable";
import MovementsTableContent from "./MovementsTableContent";
import LoadingState from "./LoadingState";
import AlertNotification from "./AlertNotification";
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
  
  // Estados centralizados para manejo de notificaciones
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Muestra un mensaje de éxito, evitando duplicados
   * @param message - Mensaje a mostrar
   */
  const showSuccessMessage = (message: string) => {
    // Limpiar mensaje anterior si existe
    if (successMessage) {
      setSuccessMessage("");
      // Pequeño delay para evitar conflictos visuales
      setTimeout(() => setSuccessMessage(message), 100);
    } else {
      setSuccessMessage(message);
    }
    
    // Auto-limpiar después de 3 segundos
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  /**
   * Muestra un mensaje de error, evitando duplicados
   * @param message - Mensaje de error a mostrar
   */
  const showErrorMessage = (message: string) => {
    // Limpiar mensaje anterior si existe
    if (errorMessage) {
      setErrorMessage("");
      // Pequeño delay para evitar conflictos visuales
      setTimeout(() => setErrorMessage(message), 100);
    } else {
      setErrorMessage(message);
    }
    
    // Auto-limpiar después de 3 segundos
    setTimeout(() => setErrorMessage(""), 3000);
  };

  /**
   * Limpia manualmente el mensaje de éxito
   */
  const clearSuccessMessage = () => {
    setSuccessMessage("");
  };

  /**
   * Limpia manualmente el mensaje de error
   */
  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  /**
   * Elimina un movimiento específico de la lista local y del servidor
   * @param index - Índice del movimiento en la lista local
   */
  const deleteMovement = (index: number) => {
    if (!movements) return;
    
    try {
      // Filtrar el movimiento de la lista local para actualización inmediata de UI
      const updatedMovements = movements.filter((_, i) => i !== index);
      setMovements(updatedMovements);
      
      // Enviar petición al servidor para eliminar el movimiento
      fetchDeleteMovement(movements[index].id, expireSession);
      
      // Mostrar mensaje de éxito
      showSuccessMessage("Movimiento eliminado exitosamente");
    } catch (error) {
      // Mostrar mensaje de error
      showErrorMessage("Error al eliminar el movimiento. Intenta nuevamente.");
    }
  };

  /**
   * Añade un nuevo movimiento a la lista local
   * @param movement - Nuevo movimiento a añadir
   */
  const addMovement = (movement: Movement) => {
    setMovements(current => current ? [...current, movement] : [movement]);
    showSuccessMessage("Movimiento creado exitosamente");
  };

  // Hook personalizado para obtener los movimientos del servidor al montar el componente
  useFetchMovements(setMovements, expireSession);

  return (
    <div className="p-4">
      {/* Notificación centralizada fuera de la tabla */}
      <AlertNotification
        message={successMessage}
        error={errorMessage}
        onClearMessage={clearSuccessMessage}
        onClearError={clearErrorMessage}
      />
      
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
              onShowError={showErrorMessage}
              expireSession={expireSession}
            />
          )}
        </BaseTable>
      )}
    </div>
  );
}
