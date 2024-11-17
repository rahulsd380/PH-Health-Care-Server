import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const {refreshToken} = result;

    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
    })

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged in successfully",
        data: {
            accessToken : result.accessToken,
            needsPasswordChange : result.needsPasswordChange
        }
    })
});

const refreshToken = catchAsync(async (req, res) => {
    const {refreshToken} = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "New access token generated successfully",
        data: result
        // data: {
        //     accessToken : result.accessToken,
        //     needsPasswordChange : result.needsPasswordChange
        // }
    })
});

const changePassword = catchAsync(async (req :Request & {user?:any}, res:Response) => {
    const user = req.user;
    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "password changed successfully",
        data: result
    })
});

const forgotPassword = catchAsync(async (req :Request, res:Response) => {
    await AuthServices.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Check your email!",
        data: null
    })
});

const resetPassword = catchAsync(async (req :Request, res:Response) => {
    const token = req.headers.authorization || ""
    await AuthServices.resetPassword(token, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password reset!",
        data: null
    })
});

export const AuthControllers = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}