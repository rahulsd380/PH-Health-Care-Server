import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
    try {
        const result = await UserServices.createAdmin(req.body);
        res.status(200).json({
            success: true,
            message: "Admin Created Successfully.",
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

export const UserControllers = {
    createAdmin,
}
