import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { jwtHelpers } from "../../../helpers/jwtHelpers";


const loginUser = async (payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
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
        "abcdefgh",
        "15m"
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

    const decodedData = jwt.verify(token, 'abcdefghijk') as JwtPayload;

    const userData = await prisma.user.findUniqueOrThrow({
        where : {
            email : decodedData?.email
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