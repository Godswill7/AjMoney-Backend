import { Router } from "express";
import { deletetUser, getAllUsers, getOneUser, signInUser, userRegistration } from "./userController";
import { getAllTransaction, getOneTransaction, initializeTrans, payWithPaystack, verifyTransaction } from "../configuration/paystack";

const router = Router();

router.route("/create-user").post(userRegistration)
router.route("/sign-in-user").post(signInUser)
router.route("/:id/get-one-user").get(getOneUser);
router.route("/get-all-users").get(getAllUsers);
router.route("/:id/delete-user").delete(deletetUser);
router.route("/make-pay").post(payWithPaystack);
router.route("/verify-pay").get(verifyTransaction);
router.route("/get-all-transc").get(getAllTransaction);
router.route("/:id/get-one-transc").get(getOneTransaction);

export default router;