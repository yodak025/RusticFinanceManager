import { Card, CardContent } from "../ui/card";
import { Component } from "../PieChart";
import { useState, useEffect } from "react";

interface GeneralInfo {
  localIncome: number;
  localExpenses: number;
  total: number;
}

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

export default function GeneralMenu() {
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  useEffect(() => {
    fetchGeneralInfo().then((data) => setGeneralInfo(data));
  }, []);

  return (
    <article className="grid grid-cols-4 grid-rows-3 gap-10 m-5">
      <Card className="p-20">
        <CardContent>
          <h1>Context</h1>
        </CardContent>
      </Card>
      <Card className="p-20">
        <CardContent>
          <h1>Context</h1>
        </CardContent>
      </Card>
      <Card className="p-20">
        <CardContent>
          <h1>Context</h1>
        </CardContent>
      </Card>
      <Card className="p-20">
        <CardContent>
          <h1>Context</h1>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardContent>
          <h1>Valor Total</h1>
          {generalInfo ? (
            <p>Total: {generalInfo.total}</p>
          ) : (
            <p>Cargando información...</p>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-2 row-span-2">
        <CardContent>
          <Component />
        </CardContent>
      </Card>
      <Card className="col-span-2 ">
        <CardContent>
          <h1>Balance</h1>
          {generalInfo ? (
            <p>
              Ingresos: {generalInfo.localIncome} <br />
              Gastos: {generalInfo.localExpenses} <br />
            </p>
          ) : (
            <p>Cargando información...</p>
          )}
        </CardContent>
      </Card>
    </article>
  );
}
