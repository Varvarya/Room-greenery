import {authJwt, verifySignUp} from "../middleware";
import { UserController } from "../controllers/user.controller"
import {Router} from "express";

const router = Router();
const userController = new UserController();

router.get("/test/all", userController.allAccess);
router.get(
    "/test/user",
    [authJwt.verifyToken],
    userController.userBoard
);
router.get(
    "/test/moder",
    [authJwt.verifyToken, authJwt.isModerator],
    userController.moderatorBoard
);
router.get(
    "/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
);
router.get('/all',
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.getAll
)
router.get('/organizations',
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.getAllWithOrganizations)
router.get('/me',
    [authJwt.verifyToken],
    userController.getMe
);
router.post('/',
    [authJwt.verifyToken, authJwt.isAdminOrModer],
    userController.get
);
router.get('/user/:id?',
    [authJwt.verifyToken],
    userController.getById
);
router.delete(
    "/user",
    [authJwt.verifyToken, authJwt.isAdminOrModer],
    userController.deleteByName
);
router.delete(
    "/user/:userId",
    [authJwt.verifyToken, authJwt.isAdminOrModer],
    userController.deleteById
);
router.put(
    '/user/:userId',
    [authJwt.verifyToken, authJwt.isAdminOrModer,
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRoleExisted],
    userController.update
)

export default router;