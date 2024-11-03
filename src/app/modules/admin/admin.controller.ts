import { Request, Response } from "express"
import { AdminServices } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const result = await AdminServices.getAllAdmins();
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
}


export const AdminControllers = {
    getAllAdmins,
}