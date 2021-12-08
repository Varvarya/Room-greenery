import { Router } from 'express';
import {authJwt} from "../middleware";
import {PlantController} from "../controllers/plant.controller";

const router = Router();
const plantController = new PlantController();

router.get('/:id', [authJwt.verifyToken], plantController.get);
router.get('/organization/:id?', [authJwt.verifyToken], plantController.getAllInOrganization);
router.post('/', [authJwt.verifyToken, authJwt.isAdminOrModer], plantController.create);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], plantController.update);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], plantController.deleteById);

export default router;