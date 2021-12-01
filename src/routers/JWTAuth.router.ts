import { Router } from 'express';
import JwtAuthController from '../controllers/jwtauth.controller';
import {verifySignUp} from "../middleware";

const router = Router();
const jwtAuthController = new JwtAuthController();

router.post('/register',  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRoleExisted], jwtAuthController.signUp);
router.post('/login', jwtAuthController.signIn);

export default router;