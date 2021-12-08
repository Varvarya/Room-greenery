import { Router } from 'express';
import {authJwt} from "../middleware";
import SpeciesController from "../controllers/species.controller";

const router = Router();
const speciesController = new SpeciesController();

router.get('/:name', [authJwt.verifyToken], speciesController.get);
router.post('/', [authJwt.verifyToken, authJwt.isAdminOrModer], speciesController.create);
router.put('/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], speciesController.update);
router.delete('/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], speciesController.deleteById);
router.delete('/:species:', [authJwt.verifyToken, authJwt.isAdminOrModer], speciesController.deleteByName);
router.get('/average/:name', [authJwt.verifyToken], speciesController.defaultParamsForSpecies)

export default router;