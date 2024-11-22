import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import auth from '../../middlewares/auth';
import multer from 'multer';
import { UserRole } from '@prisma/client';
import { uploadFile } from '../../../helpers/uploadFile';

const router = express.Router();

router.post('/create-admin',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    uploadFile.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    }, 
    UserControllers.createAdmin
);

router.post('/create-doctor',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    uploadFile.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    }, 
    UserControllers.createDoctor
);

router.get('/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserControllers.getAllFromDB
);

router.get('/me',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    UserControllers.getMyProfile
);

router.patch(
    '/:id/status',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    UserControllers.changeProfileStatus
);

export const UserRoutes = router;