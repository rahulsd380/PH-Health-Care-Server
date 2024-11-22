import { Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constants";

const createAdmin = async (req: Request, res: Response) => {
        const result = await UserServices.createAdmin(req);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin created successfully!",
            data: result
        })
};

const createDoctor = async (req: Request, res: Response) => {
        const result = await UserServices.createDoctor(req);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Doctor created successfully!",
            data: result
        })
};

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await UserServices.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users data fetched!",
        meta: result.meta,
        data: result.data
    })
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await UserServices.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});

const getMyProfile = catchAsync(async(req: Request, res: Response) => {
    const user = req.user;
    const result = await UserServices.getMyProfile(user)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile fetched successfully.",
        data: result
    })
});

const updateProfile = catchAsync(async(req: Request, res: Response) => {
    const user = req.user;
    const result = await UserServices.updateProfile(user, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile updated successfully.",
        data: result
    });
});

export const UserControllers = {
    createAdmin,
    createDoctor,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateProfile,
}
