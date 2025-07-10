import { useEffect, useState } from "react";

// Tipo para representar una cuenta
export interface Account {
  name: string;
  amount: number;
}

/**
 * Hook personalizado para obtener las cuentas del usuario autenticado
 * @param onSessionExpired - Función a ejecutar si la sesión ha expirado
 * @param isNewAccount - Indica si se ha creado una nueva cuenta
 * @param setIsNewAccount - Función para actualizar el estado de si se ha creado una nueva cuenta
 * @returns Array de cuentas o null si aún está cargando
 */
export function useFetchAccounts(
  onSessionExpired: () => void,
  isNewAccount: boolean,
  setIsNewAccount: (value: boolean) => void
): Account[] | null {
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  useEffect(() => {
    if (isNewAccount) {
      // Si se ha creado una nueva cuenta, actualizamos el estado
      setIsNewAccount(false);
    }
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/accounts");

        if (response.status === 401) {
          onSessionExpired();
          throw new Error("Session expired, please log in again.");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Verificar que el objeto tenga la clave 'numberOfAccounts'
        if (
          !data ||
          typeof data !== "object" ||
          !("numberOfAccounts" in data)
        ) {
          throw new Error(
            "Invalid response format: missing numberOfAccounts key"
          );
        }

        const numberOfAccounts = data.numberOfAccounts;

        // Obtener los detalles de cada cuenta
        const accountPromises = [];
        for (let i = 0; i < numberOfAccounts; i++) {
          accountPromises.push(fetchAccountById(i, onSessionExpired));
        }

        const fetchedAccounts = await Promise.all(accountPromises);
        setAccounts(fetchedAccounts);
        console.log("Accounts fetched:", fetchedAccounts);
      } catch (error) {
        console.error("Error cargando cuentas:", error);
        setAccounts([]);
      }
    };

    fetchAccounts();
  }, [onSessionExpired, isNewAccount, setIsNewAccount]);

  return accounts;
}

/**
 * Obtiene los detalles de una cuenta específica por su ID
 * @param id - ID de la cuenta
 * @param onSessionExpired - Función a ejecutar si la sesión ha expirado
 * @returns Promesa que resuelve con los datos de la cuenta
 */
const fetchAccountById = async (
  id: number,
  onSessionExpired: () => void
): Promise<Account> => {
  try {
    const response = await fetch(`/accounts/${id}`);

    if (response.status === 401) {
      onSessionExpired();
      throw new Error("Session expired, please log in again.");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const account = await response.json();

    // Verificar que la cuenta tenga las propiedades necesarias
    if (!account || typeof account !== "object") {
      throw new Error("Invalid response format: account is not an object");
    }

    if (
      typeof account.name !== "string" ||
      typeof account.amount !== "number"
    ) {
      throw new Error("Invalid account format: missing or invalid name/amount");
    }

    return account as Account;
  } catch (error) {
    console.error(`Error fetching account ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva cuenta financiera
 * @param account - Datos de la nueva cuenta (nombre y saldo inicial)
 * @param onSessionExpired - Función a ejecutar si la sesión ha expirado
 * @returns Promesa que resuelve cuando la cuenta se crea exitosamente
 */
export const fetchCreateAccount = async (
  account: { name: string; amount: number },
  onSessionExpired: () => void
): Promise<void> => {
  try {
    const response = await fetch("/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account }),
    });

    if (response.status === 401) {
      onSessionExpired();
      throw new Error("Session expired, please log in again.");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Account created successfully");
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};
