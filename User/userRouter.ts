import { Router } from "express";
import { deletetUser, getAllUsers, getOneUser, signInUser, userRegistration } from "./userController";

const router = Router();

router.route("/create-user").post(userRegistration)
router.route("/sign-in-user").post(signInUser)
router.route("/:id/get-one-user").get(getOneUser);
router.route("/get-all-users").get(getAllUsers);
router.route("/:id/delete-user").delete(deletetUser);

export default router;