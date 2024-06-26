import { NextFunction } from "express";
import { Request, Response } from "express";
import { mainError } from "../error/rootError";
import errorBuilder from "../error/errorHandler";
import { Document } from "mongoose";

export const errorHandler = (
  err: mainError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorBuilder(err, res);
};

export interface iError {
  name: string;
  message: string;
  status: HTTP;
  success: boolean;
}

export enum HTTP {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500
}
// interface Transaction {
//   amount: number;
//   description?: string;
//   timestamp: Date;
//   senderID: string;
//   receiverID: string;
//   type: "debit" | "credit";
// }
interface Transaction {
  authorization_url: string;
  access_code: string;
  reference: string;
}

// interface Paystack {
//   authorization_url: string;
//   access_code: string;
//   reference: string;
// }

interface User {
  name: string;
  email: string;
  paystack_ref:string;
  password: string;
  history: Transaction[];
  balance: number;
}

export interface userInfo extends User, Document { };
export interface transactionInfo extends Transaction, Document { };
