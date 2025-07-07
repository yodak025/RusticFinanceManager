import { type ColumnDef } from "@tanstack/react-table";
import { type Movement } from "@/types/movementTypes";

/**
 * Definición de las columnas para la tabla de movimientos
 * Especifica cómo se muestran y formatean los datos de cada movimiento
 */
export const movementColumns: ColumnDef<Movement>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "amount",
    header: "Cantidad",
    // Formatear la cantidad como moneda en euros
    cell: (info) => `${(info.getValue() as number).toFixed(2)}€`,
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "origin",
    header: "Origen",
  },
  {
    accessorKey: "destination",
    header: "Destino",
  },
  {
    accessorKey: "tags",
    header: "Etiquetas",
    // Mostrar tags como una cadena separada por comas
    cell: (info) => {
      const tags = info.getValue() as string[];
      return tags?.length ? tags.join(', ') : '-';
    },
  },
];
