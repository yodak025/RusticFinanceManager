# Módulo de Movimientos

Este módulo contiene todos los componentes relacionados con la gestión de movimientos financieros en la aplicación Rustic Finance Manager.

## Estructura de Componentes

### Componentes Principales

- **`MovementsMenu.tsx`** - Componente principal que gestiona el estado global de los movimientos y coordina las operaciones CRUD.

- **`MovementsTableContent.tsx`** - Componente que maneja el contenido de la tabla, incluyendo la lista de movimientos y el formulario para crear nuevos.

- **`NewMovementForm.tsx`** - Formulario interactivo para crear nuevos movimientos financieros con validación y notificaciones.

- **`MovementRow.tsx`** - Componente que representa una fila individual de movimiento en la tabla.

### Componentes de Utilidad

- **`AlertNotification.tsx`** - Sistema de notificaciones centralizado para mostrar mensajes de éxito y error desde el componente principal.

- **`LoadingState.tsx`** - Indicador de carga que se muestra mientras se obtienen los datos del servidor.

- **`DeleteMovementButton.tsx`** - Botón con confirmación para eliminar movimientos (ya existía).

### Configuración

- **`movementColumns.ts`** - Definición de las columnas para la tabla de movimientos con formateo personalizado.

- **`index.ts`** - Archivo de exportaciones para facilitar las importaciones desde otros módulos.

## Funcionalidades

### Gestión de Movimientos
- Visualización en tabla de todos los movimientos
- Creación de nuevos movimientos con formulario interactivo
- Eliminación de movimientos con confirmación
- Carga asíncrona de datos con indicadores visuales

### Experiencia de Usuario
- Notificaciones centralizadas en tiempo real para acciones completadas
- Sistema de prevención de notificaciones duplicadas
- Interfaz responsiva y accesible
- Validación de formularios
- Estados de carga claros
- Manejo mejorado de errores a nivel global

### Integraciones
- Conexión con el backend Flask a través de hooks personalizados
- Gestión de sesiones y autenticación
- Manejo de errores y reconexión automática

## Uso

Para usar el módulo completo, simplemente importa el componente principal:

```tsx
import { MovementsMenu } from '@/components/movements';

// En tu componente
<MovementsMenu expireSession={handleSessionExpiry} />
```

Para usar componentes individuales:

```tsx
import { NewMovementForm, AlertNotification } from '@/components/movements';
```

## Arquitectura

El módulo sigue principios de:
- **Separación de responsabilidades**: Cada componente tiene una función específica
- **Centralización de estado**: Las notificaciones se manejan desde el componente principal
- **Reutilización**: Componentes pequeños y enfocados que pueden reutilizarse
- **Prevención de duplicados**: Sistema que evita mostrar múltiples notificaciones simultáneas
- **Mantenibilidad**: Código bien documentado y estructurado
- **Escalabilidad**: Arquitectura que facilita agregar nuevas funcionalidades

### Flujo de Notificaciones

1. **MovementsMenu.tsx** mantiene el estado centralizado de las notificaciones
2. Las funciones `showSuccessMessage` y `showErrorMessage` manejan la prevención de duplicados
3. Los componentes hijos reciben solo las funciones necesarias para mostrar errores
4. `AlertNotification.tsx` se renderiza una sola vez fuera de la tabla
5. Auto-limpieza de mensajes después de 3 segundos y limpieza manual disponible
