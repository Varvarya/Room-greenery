import { Router } from 'express';
import {authJwt} from "../middleware";
import SpeciesController from "../controllers/species.controller";
import RoleController from "../controllers/role.controller";

const router = Router();
const roleController = new RoleController();

router.get('/', roleController.getAll)
router.get('/:role', [authJwt.verifyToken, authJwt.isAdmin], roleController.get);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], roleController.create);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], roleController.update);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], roleController.deleteById);
router.delete('/:role:', [authJwt.verifyToken, authJwt.isAdminOrModer], roleController.deleteByName);

export default router;