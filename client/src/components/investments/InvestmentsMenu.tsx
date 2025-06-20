import { type ColumnDef } from "@tanstack/react-table";
type Entry = {
  date: string;
  localAmount: number;
  localRentability: number;
  localProfit: number;
  partialValue: number;
};

type Investment = {
  ticker: string;
  entityName: string;
  entries: Entry[];
  globalAmount: number;
  globalRentability: number;
  globalProfit: number;
  totalValue: number;
};

const investmentsExample: Investment[] = [
  {
    ticker: "AAPL",
    entityName: "Apple Inc.",
    entries: [
      {
        date: "2023-01-01",
        localAmount: 1000,
        localRentability: 0.05,
        localProfit: 50,
        partialValue: 1050,
      },
      {
        date: "2023-02-01",
        localAmount: 500,
        localRentability: 0.03,
        localProfit: 15,
        partialValue: 565,
      },
    ],
    globalAmount: 1500,
    globalRentability: 0.04,
    globalProfit: 65,
    totalValue: 1565,
  },
  {
    ticker: "GOOGL",
    entityName: "Alphabet Inc.",
    entries: [
      {
        date: "2023-01-15",
        localAmount: 2000,
        localRentability: 0.06,
        localProfit: 120,
        partialValue: 2120,
      },
    ],
    globalAmount: 2000,
    globalRentability: 0.06,
    globalProfit: 120,
    totalValue: 2120,
  },
];

const columns: ColumnDef<Investment>[] = [
  {
    accessorKey: "entityName",
    header: "Entidad",
  },
  {
    accessorKey: "globalAmount",
    header: "Monto Global",
  },
  {
    accessorKey: "globalRentability",
    header: "Rentabilidad Global",
  },
  {
    accessorKey: "globalProfit",
    header: "Ganancia Global",
  },
  {
    accessorKey: "totalValue",
    header: "Valor Total",
  }
];

import { flexRender } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

import BaseTable from "../tables/BaseTable";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const InvestmentsTableContent = ({ table }: any) => {
  return (
    <>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: any) => (
          <>
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}

              </TableRow>
              <Collapsible>
        <CollapsibleTrigger className="w-full text-left">
          Ver Detalles
        </CollapsibleTrigger>
        <CollapsibleContent>
          {table.getRowModel().rows.map((row: any) => (
            <div key={row.id} className="p-4">
              <h3 className="font-bold">Detalles de {row.original.entityName}</h3>
              {row.original.entries.map((entry: Entry, index: number) => (
                <div key={index} className="mb-2">
                  <p>Fecha: {entry.date}</p>
                  <p>Monto Local: {entry.localAmount}</p>
                  <p>Rentabilidad Local: {entry.localRentability}</p>
                  <p>Ganancia Local: {entry.localProfit}</p>
                  <p>Valor Parcial: {entry.partialValue}</p>
                </div>
              ))}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
          </>
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

export default function InvestmentsMenu() {
  return (
    <div className="p-4">
      <BaseTable data={investmentsExample} columns={columns}>
        {(table: any) => (
          // Tu contenido que usa table
          <InvestmentsTableContent table={table} />
        )}
      </BaseTable>
    </div>
  );
}
