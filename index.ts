import express, { Application } from "express";
import { main } from "./main";

const port: number | undefined | string = process.env.PORT! || 33900;

const app: Application = express();

main(app);

const server = app.listen(process.env.PORT! || port, () => {
  console.log("Server is active");
});

process.on("uncaughtException", (error: Error) => {
  console.log(`uncaughtException: ${error.message}`);
});

process.on("unhandledRejection", (reason: Error | any) => {
  console.log(`unhandledRejection: ${reason}`);
});

process.on("end", () => {
  server.close();
});
