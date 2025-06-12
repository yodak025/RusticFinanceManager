import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { CreateAndDeleteMov } from "../CreateAndDeleteMov";
import { type Movement } from "@/types/movementTypes";
import useFetchMovements from "@/hooks/movementsFetching";
import DeleteMovementButton from "./DeleteMovementButton";
import { Button } from "../ui/button";

const columns: ColumnDef<Movement>[] = [
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
    cell: (info) => `${(info.getValue() as number).toFixed(2)}€`,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "origin",
    header: "Origin",
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
];

import { flexRender } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

import BaseTable from "../tables/BaseTable";

const MovementsTableContent = ({ table }: any) => {
  return (
    <>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: any) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            <>
              {row.getVisibleCells().map((cell: any) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              <TableCell>
                <DeleteMovementButton
                  onDelete={() => {
                    // Aquí puedes implementar la lógica para eliminar el movimiento
                    console.log("Eliminar movimiento:", row.original);
                  }}
                />
              </TableCell>
            </>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell colSpan={columns.length} className="text-center p-4">
          <Button
            className=" text-white font-bold py-2 px-4 
           text-3xl rounded-full shadow-lg transition-colors duration-200 hover:shadow-xl"
          >
            +
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function MovementsMenu() {
  const [movements, setMovements] = useState<Movement[] | null>(null);
  useFetchMovements(setMovements);

  return (
    <div className="p-4">
      {!movements ? (
        <div className="flex justify-center items-center h-24">
          <p>Cargando movimientos...</p>
        </div>
      ) : (
        <BaseTable data={movements} columns={columns}>
          {(table: any) => (
            // Tu contenido que usa table
            <MovementsTableContent table={table} />
          )}
        </BaseTable>
      )}
      <CreateAndDeleteMov />
    </div>
  );
}
