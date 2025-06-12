import { type GeneralInfo } from "@/types/generalInfoTypes";
import { useEffect } from "react";

const isValidGeneralInfo = (data: any): data is GeneralInfo => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.localIncome === "number" &&
    typeof data.localExpenses === "number" &&
    typeof data.total === "number"
  );
};

const fetchGeneralInfo = async (): Promise<GeneralInfo> => {
  try {
    const response = await fetch("/auth/me");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (isValidGeneralInfo(data)) {
      return data;
    } else {
      throw new Error(
        "La respuesta no tiene el formato esperado: {income: number, expenses: number, balance: number}"
      );
    }
  } catch (error) {
    throw new Error(
      `Error al obtener información general: ${(error as Error).message}`
    );
  }
};

export default function useFetchGeneralInfo(
  setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfo | null>>
) {
  useEffect(() => {
    fetchGeneralInfo()
      .then((data) => {
        console.log("Información general obtenida:", data);
        setGeneralInfo(data);
      })
      .catch((error) => {
        console.error("Error al obtener información general:", error);
      });
  }, []);
}
