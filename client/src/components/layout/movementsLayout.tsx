import { useState } from "react";
import { Button } from "@/components/ui/button";
import MovementsTable from "@/components/movements/MovementsTable";
import LoadingState from "@/components/movements/LoadingState";
import AlertNotification from "@/components/movements/AlertNotification";
import NewAccountModal from "@/components/movements/NewAccountModal";
import useFetchMovements from "@/hooks/movementsFetching";
import { useAlertStore } from "@/store/useAlertStore";
import { AlertType } from "@/types/alertTypes";
import { type Movement } from "@/types/movementTypes";

/**
 * Layout principal para la gestión de movimientos
 * Contiene la estructura general, notificaciones y modales
 */
export default function MovementsLayout() {
  // Estado para almacenar la lista de movimientos obtenidos del servidor
  const [movements, setMovements] = useState<Movement[] | null>(null);
  
  // Estado para controlar la visibilidad del modal de nueva cuenta
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);

  // Estado para controlar si se ha creado una nueva cuenta
  const [isNewAccount, setIsNewAccount] = useState(false);

  // Hook personalizado para obtener los movimientos del servidor
  const refetchMovements = useFetchMovements(setMovements);

  // Acceso al store de alertas
  const { addAlert } = useAlertStore();

  /**
   * Muestra un mensaje de éxito usando el store de alertas
   * @param message - Mensaje a mostrar
   */
  const showSuccessMessage = (message: string) => {
    addAlert(AlertType.MESSAGE, message);
  };

  /**
   * Muestra un mensaje de error usando el store de alertas
   * @param message - Mensaje de error a mostrar
   */
  const showErrorMessage = (message: string) => {
    addAlert(AlertType.ERROR, message);
  };

  /**
   * Maneja la creación exitosa de una nueva cuenta
   * Cierra el modal y muestra mensaje de éxito
   */
  const handleAccountCreated = () => {
    setIsNewAccountModalOpen(false);
    showSuccessMessage("Cuenta creada exitosamente");
    setIsNewAccount(true);
  };

  /**
   * Maneja la creación exitosa de un nuevo movimiento
   * Recarga la lista desde el servidor
   */
  const handleMovementCreated = async () => {
    try {
      await refetchMovements();
      showSuccessMessage("Movimiento creado exitosamente");
    } catch (error) {
      showErrorMessage("Error al recargar los movimientos.");
    }
  };

  return (
    <div className="p-4">
      {/* Notificación centralizada */}
      <AlertNotification />
      
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
        /* Tabla de movimientos encapsulada */
        <MovementsTable
          movements={movements}
          onShowSuccess={showSuccessMessage}
          onShowError={showErrorMessage}
          onMovementCreated={handleMovementCreated}
          refetchMovements={refetchMovements}
          newAccount={{isNewAccount, setIsNewAccount}}
        />
      )}

      {/* Modal para crear nueva cuenta */}
      <NewAccountModal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
        onAccountCreated={handleAccountCreated}
        onShowError={showErrorMessage}
        onShowSuccess={showSuccessMessage}
      />
    </div>
  );
}
