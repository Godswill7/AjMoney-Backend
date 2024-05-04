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
  errorBuilder(err, req, res);
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
  BAD_REQUEST = 404,
  NOT_FOUND,
  CONFILT = 409,
}

interface user {
  name: string;
  email:string,
  password: string;
  history: string;
  balance: number;
}

export interface userInfo extends user, Document { };
