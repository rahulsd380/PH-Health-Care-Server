import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import { sendEmail } from "../../../shared/sendEmail";


const loginUser = async (payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
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

const refreshToken = async (token: string) => {
    if (!token) {
        throw new Error("You are not authorized!")
    };

    const decodedData = jwtHelpers.verifyToken(token, 'abcdefghijk') as JwtPayload;

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE
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



};

const changePassword = async (user:any, payload:{oldPassword:string, newPassword:string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isPasswordCorrect = await bcrypt.compare(payload.oldPassword, userData.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid Password")
    };

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully"
    };
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: payload.email,
        status: UserStatus.ACTIVE,
      },
    });
  
    const resetPasswordToken = jwtHelpers.generateToken(
      {
        email: userData.email,
        role: userData.role,
      },
      config.reset_password_secret as Secret,
      config.reset_password_expires_in as string
    );
  
    const resetPasswordLink =
      config.reset_password_link +
      `?email=${encodeURIComponent(userData.email)}&token=${encodeURIComponent(resetPasswordToken)}`;
  
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4CAF50;">Reset Your Password</h2>
        <p>Dear User,</p>
        <p>We received a request to reset your password. If you did not request this, please ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <div style="margin: 20px 0;">
          <a href="${resetPasswordLink}" style="text-decoration: none;">
            <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              Reset Password
            </button>
          </a>
        </div>
        <p>If the button above does not work, copy and paste the following link into your browser:</p>
        <p><a href="${resetPasswordLink}" style="color: #4CAF50;">${resetPasswordLink}</a></p>
        <p>Thank you,<br>The Support Team</p>
      </div>
    `;
  
    await sendEmail(userData.email, html);
  };

  const resetPassword = async (token:string, payload:{email:string, newPassword:string}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
          email: payload.email,
          status: UserStatus.ACTIVE,
        },
      });

      const isTokenVerified = jwtHelpers.verifyToken(token, config.refresh_token_secret as Secret);

      if (!isTokenVerified) {
        throw new Error("Invalid token")
    };

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword
        }
    })

  }

export const AuthServices = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}