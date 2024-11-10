import { NextFunction, Request, RequestHandler, Response } from "express"
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constants";
import sendResponse from "../../../shared/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";


const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await AdminServices.getAllAdmins(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data fetched!",
        meta: result.meta,
        data: result.data
    })
})

const getAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminServices.getAdminById(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin Fetched Successfully.",
        data: result
    });
})

const updateAdminData = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await AdminServices.updateAdminData(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin Data Updated Successfully.",
        data: result
    })
})

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminServices.deleteAdmin(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin Deleted Successfully.",
        data: result
    })
})

const softDeleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminServices.softDeleteAdmin(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin Deleted Successfully.",
        data: result
    })
})


export const AdminControllers = {
    getAllAdmins,
    getAdminById,
    updateAdminData,
    deleteAdmin,
    softDeleteAdmin,
}