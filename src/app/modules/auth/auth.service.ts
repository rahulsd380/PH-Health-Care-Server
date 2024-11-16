import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../config";


const loginUser = async (payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status : UserStatus.ACTIVE
        }
    });

    const isPasswordCorrect = await bcrypt.compare(payload.password, userData.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid Password")
    }

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt_secret as Secret,
        config.expired_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        "abcdefghijk",
        "30d"
    );

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: userData.needPasswordChange
    }
};

const refreshToken = async(token:string) => {
    if(!token){
        throw new Error("You are not authorized!")
    };

    const decodedData = jwtHelpers.verifyToken(token, 'abcdefghijk') as JwtPayload;

    const userData = await prisma.user.findUniqueOrThrow({
        where : {
            email : decodedData?.email,
            status : UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        "abcdefgh",
        "15m"
    );

    return {
        accessToken,
        needsPasswordChange: userData.needPasswordChange
    }



}

export const AuthServices = {
    loginUser,
    refreshToken
}