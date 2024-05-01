import { Application, Request, Response, json } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { NextFunction } from "connect";
import { mainError } from "./error/rootError";
import { HTTP, errorHandler } from "./utils/interface";

export const appConfig = (app: Application) => {
  app.use(json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));

  app.get("/", (req: Request, res: Response) => {
    try {
      return res.status(HTTP.OK).json({
        message: "AJ Money Api is ready",
      });
    } catch (error: Error | any) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "ErrorAcessing API route",
          data: error.message,
      });
    }
  });

  app
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      new mainError({
        name: `This is an API Route Error`,
        status: HTTP.BAD_REQUEST,
        success: false,
        message: `This is happening as a result of invalid route being this: ${req.originalUrl}`,
      });
    })
    .use(errorHandler);
};
