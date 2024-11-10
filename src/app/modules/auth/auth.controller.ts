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

export const AuthControllers = {
    loginUser,
    refreshToken
}