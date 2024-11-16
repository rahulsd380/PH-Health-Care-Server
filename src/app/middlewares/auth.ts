import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError(401,"You are not authorized!")
            };

            const verifyUser = jwtHelpers.verifyToken(token, config.jwt_secret as Secret);
            console.log(verifyUser);
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError(401,"You are not authorized!");
            };
            next();
        } catch (err) {
            next(err)
        }
    }
};

export default auth;