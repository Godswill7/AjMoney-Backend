import { Schema, Types, model } from "mongoose";
import { userInfo } from "../utils/interface";

const userSchemas = new Schema<userInfo>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    history: [
      {
        type: Types.ObjectId,
        ref: 'history',
        default:[]
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<userInfo>("userDatas", userSchemas);
