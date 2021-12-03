import {authJwt, verifySignUp} from "../middleware";
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
router.delete(
    "",
    [authJwt.verifyToken, authJwt.isAdminOrModer],
    userController.deleteByName
);
router.delete(
    "/:userId",
    [authJwt.verifyToken, authJwt.isAdminOrModer],
    userController.deleteById
);
router.put(
    '/:userId',
    [authJwt.verifyToken, authJwt.isAdminOrModer,
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRoleExisted],
    userController.update
)

export default router;