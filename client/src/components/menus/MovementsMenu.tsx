import { type ColumnDef } from "@tanstack/react-table";

enum MovementType {
  INCOME = "Ingreso",
  EXPENSE = "Gasto",
  TRANSFER = "Transferencia",
  INVESTMENT = "Inversión",
}

type Movement = {
  type: MovementType;
  amount: number;
  date: string;
  description: string;
  origin?: string;
  destination?: string;
  tags?: string[];
};

const movementsExample: Movement[] = [
  {
    type: MovementType.INCOME,
    amount: 1000,
    date: "2023-10-01",
    description: "Salary for September",
    tags: ["salary", "income"],
  },
  {
    type: MovementType.EXPENSE,
    amount: 200,
    date: "2023-10-02",
    description: "Groceries",
    tags: ["food", "groceries"],
  },
  {
    type: MovementType.TRANSFER,
    amount: 500,
    date: "2023-10-03",
    description: "Transfer to savings account",
    origin: "Checking Account",
    destination: "Savings Account",
    tags: ["transfer", "savings"],
  },
  {
    type: MovementType.INVESTMENT,
    amount: 300,
    date: "2023-10-04",
    description: "Investment in mutual funds",
    tags: ["investment", "mutual funds"],
  },
];

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
    cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
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
            {row.getVisibleCells().map((cell: any) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default function MovementsMenu() {
  return (
    <div className="p-4">
      <BaseTable data={movementsExample} columns={columns}>
        {(table: any) => (
          // Tu contenido que usa table
          <MovementsTableContent table={table} />
        )}
      </BaseTable>
    </div>
  );
}
