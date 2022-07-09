import {Router} from 'express';
import {authJwt} from "../middleware";
import {DeviceController} from "../controllers/device.controller";

const router = Router();
const deviceController = new DeviceController();

router.get('/device/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], deviceController.get);
router.get('/organization/:id?', [authJwt.verifyToken], deviceController.getAllOfOrganization);
router.get('/broken/:id?', [authJwt.verifyToken, authJwt.isModerator], deviceController.getAllBroken);
router.post('/', [authJwt.verifyToken, authJwt.isModerator], deviceController.create);
router.put('/device/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], deviceController.update);
router.delete('/device/:id', [authJwt.verifyToken, authJwt.isAdminOrModer], deviceController.deleteById);

export default router;