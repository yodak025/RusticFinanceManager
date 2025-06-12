export enum MovementType {
  INCOME = "Ingreso",
  EXPENSE = "Gasto",
  TRANSFER = "Transferencia",
  INVESTMENT = "Inversión",
}

export type Movement = {
  type: MovementType;
  amount: number;
  date: string;
  description: string;
  origin?: string;
  destination?: string;
  tags?: string[];
};
