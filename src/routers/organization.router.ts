import { Router } from 'express';
import OrganizationController from '../controllers/organization.controller';

const router = Router();
const organizationsController = new OrganizationController();

router.get('/', organizationsController.get);
router.get('/:title', organizationsController.get);
router.post('/',organizationsController.create);
router.put('/:id', organizationsController.update);

export default router;
