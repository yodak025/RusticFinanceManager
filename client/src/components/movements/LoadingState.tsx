import React from 'react';

/**
 * Componente que muestra un indicador de carga mientras se obtienen los datos
 * Proporciona feedback visual al usuario durante las operaciones asíncronas
 */
const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-24">
      <div className="flex items-center space-x-2">
        {/* Spinner de carga animado */}
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Cargando movimientos...</p>
      </div>
    </div>
  );
};

export default LoadingState;
