import { Card, CardContent } from "../ui/card";
import { Component } from "../PieChart";
import { useState } from "react";
import { type GeneralInfo } from "@/types/generalInfoTypes";
import useFetchGeneralInfo from "@/hooks/generalInfoFetching";





export default function GeneralMenu() {
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  useFetchGeneralInfo(setGeneralInfo);

  return (
    <article className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-10 m-5">
      <Card className="hidden md:block">
      <CardContent>
        <h1 className="text-center  ">Context</h1>
      </CardContent>
      </Card>
      <Card className="hidden md:block">
      <CardContent>
        <h1 className="text-center">Context</h1>
      </CardContent>
      </Card>
      <Card className="hidden md:block">
      <CardContent>
        <h1 className="text-center">Context</h1>
      </CardContent>
      </Card>
      <Card className="hidden md:block">
      <CardContent >
        <h1 className="text-center">Context</h1>
      </CardContent>
      </Card >
      <Card className="col-span-2 row-span-2">
      <CardContent>
        <Component />
      </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2">
      <CardContent>
        <h1 className="text-center ">Valor Total</h1>
        {generalInfo ? (
        <p>Total: {generalInfo.total}</p>
        ) : (
        <p>Cargando información...</p>
        )}
      </CardContent>
      </Card>
      
      <Card className=" col-span-1 md:col-span-2">
      <CardContent>
        <h1 className="text-center ">Balance</h1>
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
