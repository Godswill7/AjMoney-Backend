import { connect } from "mongoose";
import env from "dotenv"
env.config()

const url: string | undefined = process.env.DATABASE_URL!;

export const databaseConfig = async () => {
    try {
      
    await connect(url).then(() => {
      console.log("Database is working !!!");
    });
  } catch (error: Error | any) {
    console.log("Databse connection has not been established.", error);
  }
};
