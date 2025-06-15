import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { type Movement, MovementType } from "@/types/movementTypes";
import useFetchMovements, {
  fetchDeleteMovement,
  fetchCreateMovement
} from "@/hooks/movementsFetching";
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

const NewMovementButton = ({onCreateMovement, onExpiredSession}:any) => {
  const [isCreating, setIsCreating] = useState(false);
  const [movement, setMovement] = useState<Movement>(
    {
      amount: 0,
      origin: '',
      destination: '',
      type: MovementType.INCOME,
      date: '',
      description: '',
      tags: [],
      id: -1
    }
  );
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof Movement, value: any) => {
    setMovement(prev => ({ ...prev, [field]: value }));
  };

  const createMovement = async () => {
    try {
      await fetchCreateMovement(movement!, onExpiredSession);
      setMessage('Movimiento creado exitosamente');
      setError('');
      setMovement({
        amount: 0,
        origin: '',
        destination: '',
        type: MovementType.INCOME,
        date: '',
        description: '',
        tags: [],
        id: -1
      });
      setIsCreating(false);
      onCreateMovement(movement);
    } catch (err) {
      setError('Error creando movimiento');
      setMessage('');
    }
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  return (
    <>
      {message && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-lg z-50">
          {message}
          <button onClick={() => setMessage('')} className="ml-2 text-green-600 hover:text-green-800">×</button>
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow-lg z-50">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-600 hover:text-red-800">×</button>
        </div>
      )}
      <TableRow>
        {isCreating ? (
          <>
            <TableCell>
              <input
                type="date"
                value={movement.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </TableCell>
            <TableCell>
              <select
                value={movement.type }
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(MovementType).map((type: string) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </TableCell>
            <TableCell>
              <input
                type="number"
                step="0.01"
                value={movement.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </TableCell>
            <TableCell>
              <input
                type="text"
                value={movement.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descripción"
              />
            </TableCell>
            <TableCell>
              <input
                type="text"
                value={movement.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Origen"
              />
            </TableCell>
            <TableCell>
              <input
                type="text"
                value={movement.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Destino"
              />
            </TableCell>
            <TableCell>
              <input
                type="text"
                value={movement.tags?.join(', ') || ''}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tags (separadas por comas)"
              />
            </TableCell>
            <TableCell>
              <Button onClick={createMovement} className="">
                Crear Movimiento
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => setIsCreating(false)}
                className="ml-2"
              >
                🗑️
              </Button>
            </TableCell>
          </>
        ) : (
          <TableCell colSpan={columns.length} className="text-center p-4">
            <Button
              onClick={() => setIsCreating(true)}
              className="text-white font-bold py-2 px-4 text-3xl rounded-full shadow-lg transition-colors duration-200 hover:shadow-xl"
            >
              +
            </Button>
          </TableCell>
        )}
      </TableRow>
    </>
  );
};

const MovementsTableContent = ({ table, onDeleteMovement, onAddMovement, expireSession}: any) => {
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
                  onAccepted={() => {
                    onDeleteMovement(row.index);
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
      <NewMovementButton onCreateMovement={onAddMovement} onExpiredSesion={expireSession}/>
    </>
  );
};

export default function MovementsMenu({expireSession} : { expireSession: () => void }) {
  const [movements, setMovements] = useState<Movement[] | null>(null);
  const deleteMovement = (i: number) => {
    const updatedMovements = movements?.filter((_, index) => index !== i);
    setMovements(updatedMovements ? updatedMovements : movements);
    fetchDeleteMovement(movements![i].id, expireSession);
  };
  const addMovement = (movement: Movement) => {
    setMovements(movements ? [...movements, movement] : [movement]);
  }
  useFetchMovements(setMovements, expireSession);

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
            <MovementsTableContent
              table={table}
              onDeleteMovement={deleteMovement}
              onAddMovement={addMovement}

            />
          )}
        </BaseTable>
      )}
    </div>
  );
}
