import paystack from "paystack";
import { HTTP } from "../utils/interface";
import User from "../User/userModel";
import https from "https";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const TEST_SECRET: string = process.env.TEST_SECRET!;
const paystackClient: any = paystack(TEST_SECRET);

const secret_key = process.env.TEST_SECRET;

export const initializeTrans = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, amount } = req.body;

    const findUser = await User.findById(id);

    // Initialize transaction with Paystack API
    const response = await paystackClient.transaction.initialize({
      email: findUser?.email,
      amount,
      //   plan, // optional but used for subscription
    });

    // Update user document with Paystack reference

    const update = await User.findByIdAndUpdate(
      id,
      {
        paystack_ref: response.data.reference,
      },
      { new: true }
    );

    const data = {
      paystack_ref: response.data.reference,
    };

    console.log("data", data);
    // Assuming `User` model is imported and defined elsewhere
    // Update user document using appropriate method (e.g., findByIdAndUpdate)
    // await User.findByIdAndUpdate(id, data);

    res.status(HTTP.OK).json({
      data: response.data,
      update,
      message: response.message,
      status: response.status,
    });
  } catch (error: any) {
    console.error("Error initializing transaction:", error);
    res.status(HTTP.BAD_REQUEST).json({
      data: {},
      error: error.message,
      status: 1,
    });
  }
};

export const payWithPaystack = async (_req: Request, res: Response) => {
  try {
    const { email, amount } = _req.body;

    if (!email || !amount || amount <= 0) {
      return res.status(400).json({
        error: "Invalid request. Email and positive amount required.",
      });
    }

    const references = uuidv4();

    const response = await paystackClient.transaction.initialize({
      email,
      amount: amount * 100,
      reference: references,
    });

    if (!response || !response.data || !response.data.authorization_url) {
      console.error("Invalid response from Paystack API:", response);
      return res
        .status(HTTP.SERVER_ERROR)
        .json({ error: "Error making payment. Please try again later." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(HTTP.NOT_FOUND).json({ error: "User not found." });
    }

    user.history.push(response.data);
    await user.save();

    const authorizationUrl = response.data.authorization_url;
    res.redirect(authorizationUrl);
    console.log("Redirecting user to Paystack checkout:", authorizationUrl);
  } catch (error: Error | any) {
    console.log("Error making payment", error);
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error Making Payment",
    });
  }
};

export const verifyTransaction = async (req: Request, res: Response) => {
  try {
    const reference = "txs0b50m46";

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret_key}`,
      },
    };

    https
      .request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          console.log(JSON.parse(data));
        });
      })
      .on("error", (error) => {
        console.error(error);
      });
  } catch (error: Error | any) {
    console.log("Error verifying payment", error.message);
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error verifying payment",
      status: HTTP.BAD_REQUEST,
    });
  }
};

export const getAllTransaction = async (req: Request, res: Response) => {
  try {
    //   const options = {
    //     hostname: "api.paystack.co",
    //     port: 443,
    //     path: "/transaction",
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${secret_key}`,
    //     },
    //   };

    // https
    //     .request(options, (res) => {
    //       let data = "";

    //       res.on("data", (chunk) => {
    //         data += chunk;
    //       });

    //       res.on("end", () => {
    //         console.log(JSON.parse(data));
    //       });
    //     })
    //     .on("error", (error) => {
    //       console.error(error);
    //     });

    const response = await paystackClient.transaction.list();

    return res.status(HTTP.OK).json(response.data);
  } catch (error: Error | any) {
    console.log("Error getting all transaction", error.message);
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error getting all transactions",
    });
  }
};

export const getOneTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // const options = {
    //   hostname: "api.paystack.co",
    //   port: 443,
    //   path: `/transaction/${id}`,
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${secret_key}`,
    //   },
    // };

    // https
    //   .request(options, (res) => {
    //     let data = "";

    //     res.on("data", (chunk) => {
    //       data += chunk;
    //     });

    //     res.on("end", () => {
    //       console.log(JSON.parse(data));
    //     });
    //   })
    //   .on("error", (error) => {
    //     console.error(error);
    //   });

    // const request = https.request(options, (response) => {
    //   let data = "";

    //   response.on("data", (chunk) => {
    //     data += chunk;
    //   });

    //   response.on("end", () => {
    //     const transaction = JSON.parse(data);
    //     // Assuming you want to send the transaction data back as the response
    //     res.status(HTTP.OK).json(transaction);
    //   });
    // });

    // request.on("error", (error) => {
    //   console.error("Error making request:", error);
    //   res
    //     .status(HTTP.BAD_REQUEST)
    //     .json({ message: "Internal Server Error" });
    // });

    const response = await paystackClient.transaction.fetch(id);

    res.json(response.data);
  } catch (error: Error | any) {
    console.log("Error getting one transaction", error.message);
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error getting all transactions",
    });
  }
};
