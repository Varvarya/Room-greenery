import { Router } from 'express';
import {ParamsController} from "../controllers/parameters.controller";
import {authJwt} from "../middleware";

const router = Router();
const paramsController = new ParamsController();

router.get('/:id', [authJwt.verifyToken], paramsController.get);
router.put('/:id', [authJwt.verifyToken],  paramsController.update);
router.delete('/:id', [authJwt.verifyToken], paramsController.deleteById);

export default router;
