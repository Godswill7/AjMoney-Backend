import { Request, Response } from "express";
import { HTTP } from "../utils/interface";
import userModel from "./userModel";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import env from "dotenv";
env.config();

export const userRegistration = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const encrypt = await hash(password, 10);

    const createUser = await userModel.create({
      name,
      email,
      password: encrypt,
    });

    const nonce = sign({ id: createUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "10m",
    });

    return res.status(HTTP.CREATED).json({
      message: "User Created Successfully",
      data: createUser,
      nonce,
      status: HTTP.CREATED,
    });
  } catch (error: Error | any) {
    console.error("Error creating user:", error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: `"Error registering user:" ${error.message}`,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "User does not exist",
        status: HTTP.NOT_FOUND,
      });
    }

    // const confirmPassword = await compare(password, findUser.password);

    const checkIfPasswordIsCorrect: boolean = findUser
      ? await compare(password, findUser.password)
      : false;

    if (!checkIfPasswordIsCorrect) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "Password is Incorrect",
        status: HTTP.NOT_FOUND,
      });
    }

    const token = sign({ id: findUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "10m",
    });

    return res.status(HTTP.OK).json({
      message: `Welcome ${findUser.name}`,
      data: findUser,
      token,
      status: HTTP.OK,
    });
  } catch (error: Error | any) {
    console.error("Error creating user:", error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: `"Error registering user:" ${error.message}`,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userModel.find();

    return res.status(HTTP.OK).json({
      message: "All users gotten",
      data: result,
      status: HTTP.OK,
    });
  } catch (error: Error | any) {
    console.error("Error getting user:", error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: `"Error getting user:" ${error.message}`,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const getOneUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const getOneUser = await userModel.findById(id);

    return res.status(HTTP.OK).json({
      message: "User gotten successfully",
      data: getOneUser,
      status: HTTP.OK,
    });
  } catch (error: Error | any) {
    console.error("Error getting one user:", error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: `"Error getting one user:" ${error.message}`,
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const deletetUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await userModel.deleteOne({ id });

    return res.status(HTTP.OK).json({
      message: "User Deleted successful",
      status: HTTP.OK,
    });
  } catch (error: Error | any) {
    console.error("Error deleting  user:", error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: `"Error deleting user:" ${error.message}`,
      status: HTTP.BAD_REQUEST,
    });
  }
};
