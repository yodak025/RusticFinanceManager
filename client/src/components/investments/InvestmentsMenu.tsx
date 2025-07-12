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
          <Collapsible key={row.id}>
            <TableRow data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell: any) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <CollapsibleTrigger className="w-full text-left p-2 hover:bg-gray-50">
                  Ver Detalles de {row.original.entityName}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 bg-gray-50">
                    <h3 className="font-bold mb-2">Detalles de {row.original.entityName}</h3>
                    {row.original.entries.map((entry: Entry, index: number) => (
                      <div key={index} className="mb-2 p-2 border-b">
                        <p><strong>Fecha:</strong> {entry.date}</p>
                        <p><strong>Monto Local:</strong> {entry.localAmount}</p>
                        <p><strong>Rentabilidad Local:</strong> {entry.localRentability}</p>
                        <p><strong>Ganancia Local:</strong> {entry.localProfit}</p>
                        <p><strong>Valor Parcial:</strong> {entry.partialValue}</p>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </TableCell>
            </TableRow>
          </Collapsible>
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
  // Configuración de la tabla con react-table
  const table = useReactTable({
    data: investmentsExample,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
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
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <InvestmentsTableContent table={table} />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
