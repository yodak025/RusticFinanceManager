import { type Movement, MovementType } from "@/types/movementTypes";
import { useEffect } from "react";
import { useAuthStore } from "@/store/storeAuth";

const fetchMovementsIds = async (): Promise<number[]> => {
  try {
    const response = await fetch("/movements");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Verificar que el objeto tenga la clave 'movements'
    if (!data || typeof data !== "object" || !("movements" in data)) {
      throw new Error("Invalid response format: missing movements key");
    }

    // Verificar que movements sea un array
    if (!Array.isArray(data.movements)) {
      throw new Error("Invalid response format: movements is not an array");
    }
    data.movements.forEach((movementIds: unknown) => {
      if (typeof movementIds !== "number") {
        throw new Error(
          "Invalid response format: each movement should be a number"
        );
      }
    });
    return data.movements;
  } catch (error) {
    console.error("Error fetching movements:", error);
    throw error;
  }
};

const fetchMovementById = async (
  id: number
): Promise<Movement> => {
  const { logOut } = useAuthStore.getState();
  try {
    const response = await fetch(`/movements/${id}`);
    if (response.status === 401) {
      logOut();
      throw new Error("Session expired, please log in again.");
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Verificar que el objeto tenga la clave 'movement'
    if (!data || typeof data !== "object" || !("movement" in data)) {
      throw new Error("Invalid response format: missing movement key");
    }

    const movement = data.movement;

    // Verificar que movement sea un objeto válido
    if (!movement || typeof movement !== "object") {
      throw new Error("Invalid response format: movement is not an object");
    }

    // Verificar propiedades requeridas
    if (
      !movement.type ||
      !Object.values(MovementType).includes(movement.type)
    ) {
      throw new Error("Invalid movement: invalid or missing type");
    }

    if (
      typeof movement.amount !== "number" &&
      typeof movement.amount !== "string"
    ) {
      throw new Error("Invalid movement: amount must be a number or string");
    }

    // Convert string to number if needed
    if (typeof movement.amount === "string") {
      const numericAmount = parseFloat(movement.amount);
      if (isNaN(numericAmount)) {
        throw new Error(
          "Invalid movement: amount string is not a valid number"
        );
      }
      movement.amount = numericAmount;
    }

    if (typeof movement.date !== "string") {
      throw new Error("Invalid movement: date must be a string");
    }

    if (typeof movement.description !== "string") {
      throw new Error("Invalid movement: description must be a string");
    }

    return { ...movement, id: id } as Movement;
  } catch (error) {
    console.error(`Error fetching movement ${id}:`, error);
    throw error;
  }
};

export default function useFetchMovements(
  setMovements: React.Dispatch<React.SetStateAction<Movement[] | null>>
) {
  const { logOut } = useAuthStore();
  
  const fetchMovements = async () => {
    try {
      const ids = await fetchMovementsIds();
      const fetchedMovements = await Promise.all(
        ids.map((id) => fetchMovementById(id))
      );
      setMovements(fetchedMovements);
      console.log("Movements fetched:", fetchedMovements);
    } catch (error) {
      console.error("Error cargando movimientos:", error);
      setMovements([]);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [logOut]);

  // Retornar la función para poder llamarla manualmente
  return fetchMovements;
}

export async function fetchDeleteMovement(
  id: number
) {
  const { logOut } = useAuthStore.getState();
  try {
    const response = await fetch(`/movements/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    
    if (response.status === 401) {
      logOut();
      throw new Error("Session expired, please log in again.");
    }

    if (!response.ok) {
      throw new Error(data.error || "Error eliminando movimiento");
    }

    console.log("Movimiento eliminado exitosamente");
  } catch (err) {
    console.error("Error eliminando movimiento:", err);
    throw err; // Re-lanzar el error para que pueda ser capturado por el componente
  }
}

export async function fetchCreateMovement(
  movement: Movement
) {
  const { logOut } = useAuthStore.getState();
  try {
    // Convert date from DD-MM-YYYY to YYYY-MM-DD if present
    const { id, ...movementToSend } = movement;
    if (movementToSend.date) {
      const dateParts = movementToSend.date.split("-");
      if (dateParts.length === 3) {
        // Assuming input is in YYYY-MM-DD format from date input
        movementToSend.date = movementToSend.date;
      }
    }

    const response = await fetch("/movements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movement: movementToSend }),
    });

    const data = await response.json();

    if (response.status === 401) {
      logOut();
      throw new Error("Session expired, please log in again.");
    }

    if (!response.ok) {
      throw new Error(data.error || "Error creando movimiento");
    }

    console.log(data.message || "Movimiento creado exitosamente");
  } catch (err) {
    console.error("Error creando movimiento:", err);
    throw err; // Re-lanzar el error para que pueda ser capturado por el componente
  }
}
