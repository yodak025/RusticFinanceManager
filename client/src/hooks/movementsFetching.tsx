import {type  Movement, MovementType } from "@/types/movementTypes";
import { useEffect } from "react";

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

const fetchMovementById = async (id: number): Promise<Movement> => {
  try {
    const response = await fetch(`/movements/${id}`);

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

    if (typeof movement.amount !== "number" && typeof movement.amount !== "string") {
      throw new Error("Invalid movement: amount must be a number or string");
    }
    
    // Convert string to number if needed
    if (typeof movement.amount === "string") {
      const numericAmount = parseFloat(movement.amount);
      if (isNaN(numericAmount)) {
      throw new Error("Invalid movement: amount string is not a valid number");
      }
      movement.amount = numericAmount;
    }

    if (typeof movement.date !== "string") {
      throw new Error("Invalid movement: date must be a string");
    }

    if (typeof movement.description !== "string") {
      throw new Error("Invalid movement: description must be a string");
    }

    return movement as Movement;
  } catch (error) {
    console.error(`Error fetching movement ${id}:`, error);
    throw error;
  }
};

export default function useFetchMovements(setMovements: React.Dispatch<React.SetStateAction<Movement[] | null>>) {
  useEffect(() => {
  fetchMovementsIds()
    .then((ids) => Promise.all(ids.map((id) => fetchMovementById(id))))
    .then((fetchedMovements) => {
      setMovements(fetchedMovements);
      console.log("Movements fetched:", fetchedMovements);
    })
    .catch((error) => console.error("Error cargando movimientos:", error));
}, []);
}