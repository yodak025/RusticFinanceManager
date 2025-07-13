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
import { type Movement } from "@/types/movementTypes";
import { movementColumns } from "./movementColumns";
import { fetchDeleteMovement } from "@/hooks/movementsFetching";
import MovementRow from "./MovementRow";
import NewMovementForm from "./NewMovementForm";

interface MovementsTableProps {
  movements: Movement[];
  onShowSuccess: (message: string) => void;
  onShowError: (message: string) => void;
  onMovementCreated: () => Promise<void>;
  refetchMovements: () => Promise<void>;
  newAccount: {
    isNewAccount: boolean;
    setIsNewAccount: (value: boolean) => void;
  };
}

/**
 * Componente de tabla de movimientos encapsulado
 * Se enfoca únicamente en la lógica y renderizado de la tabla
 */
export default function MovementsTable({
  movements,
  onShowSuccess,
  onShowError,
  onMovementCreated,
  refetchMovements,
  newAccount
}: MovementsTableProps) {

  /**
   * Elimina un movimiento específico de la lista local y del servidor
   * @param index - Índice del movimiento en la lista local
   */
  const deleteMovement = async (index: number) => {
    if (!movements) return;
    
    try {
      await fetchDeleteMovement(movements[index].id);
      await refetchMovements();
      onShowSuccess("Movimiento eliminado exitosamente");
    } catch (error) {
      onShowError("Error al eliminar el movimiento. Intenta nuevamente.");
    }
  };

  // Configuración de la tabla con react-table
  const table = useReactTable({
    data: movements || [],
    columns: movementColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Obtener el número total de columnas para el colspan
  const totalColumns = table.getAllColumns().length + 1; // +1 por la columna de acciones

  return (
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
            onCreateMovement={onMovementCreated}
            onShowError={onShowError}
            newAccount={newAccount}
          />
        </TableBody>
      </Table>
    </div>
  );
}
