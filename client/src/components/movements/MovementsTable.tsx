import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type Movement } from "@/types/movementTypes";
import { movementColumns } from "./movementColumns";
import useFetchMovements, { fetchDeleteMovement } from "@/hooks/movementsFetching";
import MovementRow from "./MovementRow";
import NewMovementForm from "./NewMovementForm";
import LoadingState from "./LoadingState";
import AlertNotification from "./AlertNotification";
import NewAccountModal from "./NewAccountModal";

interface MovementsTableProps {}

/**
 * Componente unificado que maneja toda la funcionalidad de la tabla de movimientos
 */
export default function MovementsTable({}: MovementsTableProps) {
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
    if (successMessage) {
      setSuccessMessage("");
      setTimeout(() => setSuccessMessage(message), 100);
    } else {
      setSuccessMessage(message);
    }
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  /**
   * Muestra un mensaje de error, evitando duplicados
   * @param message - Mensaje de error a mostrar
   */
  const showErrorMessage = (message: string) => {
    if (errorMessage) {
      setErrorMessage("");
      setTimeout(() => setErrorMessage(message), 100);
    } else {
      setErrorMessage(message);
    }
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
      await fetchDeleteMovement(movements[index].id);
      await refetchMovements();
      showSuccessMessage("Movimiento eliminado exitosamente");
    } catch (error) {
      showErrorMessage("Error al eliminar el movimiento. Intenta nuevamente.");
    }
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

  /**
   * Maneja la creación exitosa de una nueva cuenta
   * Cierra el modal y muestra mensaje de éxito
   */
  const handleAccountCreated = () => {
    setIsNewAccountModalOpen(false);
    showSuccessMessage("Cuenta creada exitosamente");
    setIsNewAccount(true);
  };

  // Hook personalizado para obtener los movimientos del servidor
  const refetchMovements = useFetchMovements(setMovements);

  // Configuración de la tabla con react-table
  const table = useReactTable({
    data: movements || [],
    columns: movementColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Obtener el número total de columnas para el colspan
  const totalColumns = table.getAllColumns().length + 1; // +1 por la columna de acciones

  return (
    <div className="p-4">
      {/* Notificación centralizada */}
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
        /* Tabla integrada con funcionalidad completa */
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                  <TableHead>Acciones</TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {/* Renderizar filas de movimientos existentes */}
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: any) => (
                  <MovementRow
                    key={row.id}
                    row={row}
                    onDeleteMovement={deleteMovement}
                  />
                ))
              ) : (
                /* Mostrar mensaje cuando no hay movimientos */
                <TableRow>
                  <TableCell colSpan={totalColumns} className="h-24 text-center text-gray-500">
                    No hay movimientos registrados. ¡Crea tu primer movimiento!
                  </TableCell>
                </TableRow>
              )}
              
              {/* Formulario para crear nuevos movimientos */}
              <NewMovementForm
                onCreateMovement={handleMovementCreated}
                onShowError={showErrorMessage}
                newAccount={{isNewAccount, setIsNewAccount}}
              />
            </TableBody>
          </Table>
        </div>
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
