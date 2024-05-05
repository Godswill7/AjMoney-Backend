import { Schema, model } from "mongoose";
import { transactionInfo } from "../utils/interface";


const transactionModel = new Schema<transactionInfo>({
    amount: {
      type:Number
    },
    description: {
        type: String,
        default:""
    },
    timestamp: {
        type:Date,
    },
    senderID: {
        tyoe:String,
    },
    receiverID: {
        type: String,
    },
    type: {
        type:String
    }
}, {
    timestamps:true
});

const Transaction =  model<transactionInfo>("transaction", transactionModel);

export default Transaction;