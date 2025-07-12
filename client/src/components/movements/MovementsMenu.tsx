import { useState } from "react";
import { type Movement } from "@/types/movementTypes";
import useFetchMovements, { fetchDeleteMovement } from "@/hooks/movementsFetching";
import BaseTable from "../tables/BaseTable";
import MovementsTableContent from "./MovementsTableContent";
import LoadingState from "./LoadingState";
import AlertNotification from "./AlertNotification";
import NewAccountModal from "./NewAccountModal";
import { Button } from "../ui/button";
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

  // Estado para controlar la visibilidad del modal de nueva cuenta
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);

  // Estado para controlar si se ha creado una nueva cuenta
  const [isNewAccount, setIsNewAccount] = useState(false);

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
  const deleteMovement = async (index: number) => {
    if (!movements) return;
    
    try {
      // Enviar petición al servidor para eliminar el movimiento
      await fetchDeleteMovement(movements[index].id, expireSession);
      
      // Recargar la lista de movimientos desde el servidor
      await refetchMovements();
      
      // Mostrar mensaje de éxito
      showSuccessMessage("Movimiento eliminado exitosamente");
    } catch (error) {
      // Mostrar mensaje de error
      showErrorMessage("Error al eliminar el movimiento. Intenta nuevamente.");
    }
  };

  /**
   * Maneja la creación exitosa de un nuevo movimiento
   * Recarga la lista desde el servidor
   */
  const handleMovementCreated = async () => {
    try {
      // Recargar la lista de movimientos desde el servidor
      await refetchMovements();
      showSuccessMessage("Movimiento creado exitosamente");
    } catch (error) {
      showErrorMessage("Error al recargar los movimientos.");
    }
  };

  /**
   * Maneja la creación exitosa de una nueva cuenta
   * Cierra el modal y muestra mensaje de éxito
   */
  const handleAccountCreated = () => {
    setIsNewAccountModalOpen(false);
    showSuccessMessage("Cuenta creada exitosamente");
    setIsNewAccount(true); // Actualiza el estado para indicar que se ha creado una
    // Las cuentas se recargarán automáticamente en los selects del formulario
  };

  // Hook personalizado para obtener los movimientos del servidor al montar el componente
  const refetchMovements = useFetchMovements(setMovements, expireSession);

  return (
    <div className="p-4">
      {/* Notificación centralizada fuera de la tabla */}
      <AlertNotification
        message={successMessage}
        error={errorMessage}
        onClearMessage={clearSuccessMessage}
        onClearError={clearErrorMessage}
      />
      
      {/* Encabezado con título y botón de nueva cuenta */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-center flex-1">Gestión de Movimientos</h2>
        <Button
          onClick={() => setIsNewAccountModalOpen(true)}
          variant="outline"
          size="sm"
          className="ml-4 text-sm"
        >
          + Nueva Cuenta
        </Button>
      </div>
      
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
              onAddMovement={handleMovementCreated}
              onShowError={showErrorMessage}
              expireSession={expireSession}
              newAccount={{isNewAccount, setIsNewAccount}}
            />
          )}
        </BaseTable>
      )}

      {/* Modal para crear nueva cuenta */}
      <NewAccountModal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
        onAccountCreated={handleAccountCreated}
        onShowError={showErrorMessage}
        onShowSuccess={showSuccessMessage}
        onExpiredSession={expireSession}
      />
    </div>
  );
}
