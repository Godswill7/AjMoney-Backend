import { Request, Response } from "express"
import { HTTP } from "../utils/interface"


export const makePayment = async (req:Request,res:Response) => {
    try {
        
        const { amount, accountNumber, description } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
          return res.status(HTTP.BAD_REQUEST).json({
            message: "Invalid amount",
            status: HTTP.BAD_REQUEST,
          });
        }

        if (!accountNumber || typeof accountNumber !== "string") {
          return res.status(HTTP.BAD_REQUEST).json({
            message: "Invalid recipient",
            status: HTTP.BAD_REQUEST,
          });
        }

    } catch (error: Error | any) {
        console.log("Error making Payment", error)
        return res.status(HTTP.BAD_REQUEST).json({
          messsage: "Error Making Payment",
          data:error,
          status: HTTP.BAD_REQUEST,
        });
    }
}

// / Require paystack library
// const paystack = require("paystack-api")(process.env.TEST_SECRET);

// // initialize transaction
// const initializeTrans = async (req, res) => {
//     try {
//         let { id } = req.params;
//         const { email, amount, plan, } = req.body;

//         const response = await paystack.transaction.initialize({
//             email,
//             amount,
//             plan, // optional but we'll use for subscription
//         });

//         const data = {
//             paystack_ref: response.data.reference,
//         };

//         await User.findByIdAndUpdate(id, data);

//         res.status(200).send({
//             data: response.data,
//             message: response.message,
//             status: response.status,
//         });

//     } catch (error) {
//         res.status(400).send({ data: {}, error: `${error.message}`, status: 1 });
//     }
// };

// // verify transaction

// module.exports = {
//     ...,
//     initializeTrans,
// };