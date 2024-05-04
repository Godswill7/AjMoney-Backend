import { Request, Response } from "express";
import { HTTP } from "../utils/interface";
import userModel from "./userModel";
import { hash } from "bcrypt";

export const userRegistration = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const encrypt = await hash(password, 10);

    const createUser = await userModel.create({
      name,
      email,
      password: encrypt,
    });

    return res.status(HTTP.CREATED).json({
      message: "User Created Successfully",
      data: createUser,
      status: HTTP.CREATED,
    });
  } catch (error: Error | any) {
    return res.status(HTTP.BAD_REQUEST).json({
      message: `"Error registering user:" ${error.message}`,
      status: HTTP.BAD_REQUEST,
    });
  }
};
