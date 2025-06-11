import { Card, CardContent } from "../ui/card";
import { Component } from "../PieChart";


export default function GeneralMenu() {
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
          <div className="flex flex-row justify-around">
            <h2 className="text-green-800 ">Ingresos</h2>
            <h2 className="text-red-800 ">Gastos</h2>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
