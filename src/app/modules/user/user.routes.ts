import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import auth from '../../middlewares/auth';

const router = express.Router();



router.post('/',  UserControllers.createAdmin);

export const UserRoutes = router;