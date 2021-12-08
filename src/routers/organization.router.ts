import { Router } from 'express';
import OrganizationController from '../controllers/organization.controller';
import {authJwt} from "../middleware";

const router = Router();
const organizationsController = new OrganizationController();

router.get('/id/:id', [authJwt.verifyToken, authJwt.isAdmin], organizationsController.getById);
router.get('/name/:title', [authJwt.verifyToken, authJwt.isAdminOrModer], organizationsController.getByTitle);
router.post('/', [authJwt.verifyToken, authJwt.isAdmin], organizationsController.create);
router.put('/id/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], organizationsController.update);
router.delete('/id/:id', [authJwt.verifyToken, authJwt.isAdmin], organizationsController.deleteById);
router.delete('/name/:title', [authJwt.verifyToken, authJwt.isAdmin], organizationsController.deleteByName);

export default router;
