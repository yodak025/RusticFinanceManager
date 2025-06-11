import React, { useState } from 'react';

interface Movement {
  amount: number;
  origin?: string;
  destination?: string;
  type?: string;
  date?: string;
  description?: string;
  tags?: string[];
}

const MOVEMENT_TYPES = ["Ingreso", "Gasto", "Transferencia", "Inversión"];

export const CreateAndDeleteMov: React.FC = () => {
  const [movement, setMovement] = useState<Movement>({
    amount: 0,
    origin: '',
    destination: '',
    type: '',
    date: '',
    description: '',
    tags: []
  });
  const [deleteIndex, setDeleteIndex] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');

  const handleInputChange = (field: keyof Movement, value: any) => {
    setMovement(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !movement.tags?.includes(tagInput.trim())) {
      setMovement(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMovement(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const createMovement = async () => {
    try {
      // Convert date from DD-MM-YYYY to YYYY-MM-DD if present
      const movementToSend = { ...movement };
      if (movementToSend.date) {
        const dateParts = movementToSend.date.split('-');
        if (dateParts.length === 3) {
          // Assuming input is in YYYY-MM-DD format from date input
          movementToSend.date = movementToSend.date;
        }
      }

      const response = await fetch('/movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movement: movementToSend }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Movimiento creado exitosamente');
        setError('');
        setMovement({
          amount: 0,
          origin: '',
          destination: '',
          type: '',
          date: '',
          description: '',
          tags: []
        });
      } else {
        setError(data.error || 'Error creando movimiento');
        setMessage('');
      }
    } catch (err) {
      setError('Error de conexión');
      setMessage('');
    }
  };

  const deleteMovement = async () => {
    if (!deleteIndex.trim()) {
      setError('Ingrese un índice válido');
      return;
    }

    try {
      const response = await fetch(`/movements/${deleteIndex}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Movimiento eliminado exitosamente');
        setError('');
        setDeleteIndex('');
      } else {
        setError(data.error || 'Error eliminando movimiento');
        setMessage('');
      }
    } catch (err) {
      setError('Error de conexión');
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Messages */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Create Movement Form */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Crear Movimiento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad *
            </label>
            <input
              type="number"
              step="0.01"
              value={movement.amount}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={movement.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo</option>
              {MOVEMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origen
            </label>
            <input
              type="text"
              value={movement.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino
            </label>
            <input
              type="text"
              value={movement.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={movement.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={movement.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Agregar etiqueta"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Agregar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {movement.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={createMovement}
          className="mt-6 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Movimiento
        </button>
      </div>

      {/* Delete Movement Form */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Eliminar Movimiento</h2>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Índice del movimiento
            </label>
            <input
              type="number"
              min="0"
              value={deleteIndex}
              onChange={(e) => setDeleteIndex(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: 0, 1, 2..."
            />
          </div>
          
          <button
            onClick={deleteMovement}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Eliminar
          </button>
        </div>
        
        <p className="mt-2 text-sm text-gray-500">
          Ingrese el índice del movimiento que desea eliminar (empezando desde 0)
        </p>
      </div>
    </div>
  );
};