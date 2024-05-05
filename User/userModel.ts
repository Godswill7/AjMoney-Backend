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
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    paystack_ref: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
    history: [
      {
        type: [
          {
            authorization_url: String,
            access_code: String,
            reference: String,
          },
        ],
        ref: "history",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model<userInfo>("userDatas", userSchemas);

export default User;
