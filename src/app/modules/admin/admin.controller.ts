import { Request, Response } from "express"
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constants";
import { prisma } from "../../../shared/prisma";

const getAllAdmins = async (req: Request, res: Response) => {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    try {
        const result = await AdminServices.getAllAdmins(filters, options);
        res.status(200).json({
            success: true,
            message: "Admin Fetched Successfully.",
            meta: result.meta,
            data: result.data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.name || "Failed to create admin.",
            error: err
        });
    }
};

const getAdminById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await AdminServices.getAdminById(id);
        res.status(200).json({
            success: true,
            message: "Admin Fetched Successfully.",
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.name || "Failed to create admin.",
            error: err
        });
    }
};

const updateAdminData = async (req: Request, res: Response) => {
   
    try {
        const { id } = req.params;
        const result = await AdminServices.updateAdminData(id, req.body);
        res.status(200).json({
            success: true,
            message: "Admin Data Updated Successfully.",
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.name || "Failed to update admin data.",
            error: err
        });
    }
};

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await AdminServices.deleteAdmin(id);
        res.status(200).json({
            success: true,
            message: "Admin Deleted Successfully.",
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.name || "Failed to delete admin.",
            error: err
        });
    }
};

const softDeleteAdmin = async (req: Request, res: Response) => {
   
    try {
        const { id } = req.params;
        const result = await AdminServices.softDeleteAdmin(id);
        res.status(200).json({
            success: true,
            message: "Admin Deleted Successfully.",
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.name || "Failed to delete admin.",
            error: err
        });
    }
};


export const AdminControllers = {
    getAllAdmins,
    getAdminById,
    updateAdminData,
    deleteAdmin,
    softDeleteAdmin,
}