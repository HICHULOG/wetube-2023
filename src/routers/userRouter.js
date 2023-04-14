import express from "express";
import { edit, deleteUser } from "../controllers/userController"

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/delete", remove);

export default userRouter;