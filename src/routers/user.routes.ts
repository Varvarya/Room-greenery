import { authJwt } from "../middleware";
import { UserController } from "../controllers/user.controller"
import {Router} from "express";

const router = Router();
const userController = new UserController();

router.get("/api/test/all", userController.allAccess);
router.get(
    "/api/test/user",
    [authJwt.verifyToken],
    userController.userBoard
);
router.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
);

export default router;