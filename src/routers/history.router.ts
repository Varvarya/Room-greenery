import HistoryController from "../controllers/history.controller";
import { Router } from 'express';
import {authJwt} from "../middleware";

const router = Router();
const historyController = new HistoryController();

router.get('/:id',  [authJwt.verifyToken, authJwt.isAdminOrModer], historyController.get);

export default router;