import express, { NextFunction, Request, Response } from 'express';
import { AdminControllers } from './admin.controller';
import { AnyZodObject, z } from 'zod';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationsSchemas } from './admin.validations';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.getAllAdmins);
router.get("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.getAdminById);
router.patch("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(adminValidationsSchemas.updateAdminInfo), AdminControllers.updateAdminData);
router.delete("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.deleteAdmin);
router.delete("/soft/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminControllers.softDeleteAdmin);

export const AdminRoutes = router;