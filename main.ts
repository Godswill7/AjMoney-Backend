import { Application, Request, Response, json } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { NextFunction } from "connect";
import { mainError } from "./error/rootError";
import { HTTP, errorHandler } from "./utils/interface";
import user from "./User/userRouter"

export const main = (app: Application) => {
  app.use(json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));

  app.use("/api", user)
  


  app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    // const ip:string | undefined = req.ip;
    // const userAgent: string | undefined = req.headers["user-agent"];

    // console.log(req.rawHeaders.splice(10,1))

    // const getOS: string[] = req.rawHeaders.splice(11, 1);

    // const ip = req.ip || req.connection.remoteAddress;
    // console.log("Client IP:", ip);
    // next();

    try {
      return res.status(HTTP.OK).json({
        message: "AJ Money Api is ready",
        // ip,
        // getOS
        // userAgent
      });
    } catch (error: Error | any) {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "Error Acessing AJ MONEY API",
        data: error.message,
      });
    }
  });

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
     const error =  new mainError({
        name: `This is an API Route Error`,
        status: HTTP.BAD_REQUEST,
        success: false,
        message: `This is happening as a result of invalid route being this: ${req.originalUrl}`,
     });
    next(error)

    console.log(error.message)
    })
    .use(errorHandler);
};
