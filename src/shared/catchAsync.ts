import { NextFunction, Request, RequestHandler, Response } from "express";
import sendResponse from "./sendResponse";

export const catchAsync = (fn:RequestHandler) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            console.error(error);
            sendResponse(res, {
                statusCode: 500,
                success: false,
                message: "Internal Server Error",
                data: null
            });
        }
    };
};