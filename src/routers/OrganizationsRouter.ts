import { Router } from 'express';
import OrganizationsController from '../controllers/OrganizationsController';

const router = Router();
const organizationsController = new OrganizationsController();

router.get('/', organizationsController.get);
router.get('/:title', organizationsController.get);
router.post('/',organizationsController.create);
router.put('/:id', organizationsController.update);

export default router;
