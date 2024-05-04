import { Router } from "express";
import { userRegistration } from "./userController";

const router = Router();

router.route("/create-user").post(userRegistration)

export default router;