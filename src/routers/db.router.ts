import {DBController} from "../controllers/db.controller";
import { Router } from 'express';
import {authJwt} from "../middleware";

const router = Router();
const dbController = new DBController();

router.get('/',  [authJwt.verifyToken, authJwt.isAdmin], dbController.get);
router.post('/backup',  [authJwt.verifyToken, authJwt.isAdmin], dbController.backUp.bind(dbController));
router.post('/restore',  [authJwt.verifyToken, authJwt.isAdmin], dbController.restore.bind(dbController));

export default router;