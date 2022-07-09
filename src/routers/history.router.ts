import HistoryController from "../controllers/history.controller";
import { Router } from 'express';
import {authJwt} from "../middleware";

const router = Router();
const historyController = new HistoryController();

router.post('/:id',  [authJwt.verifyToken, authJwt.isAdminOrModer], historyController.get);

export default router;