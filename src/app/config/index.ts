import dotenv from "dotenv";
import path from "path";

dotenv.config({path:path.join(process.cwd(), '.env')})

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    expired_in: process.env.EXPIRED_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_password_secret: process.env.RESET_PASSWORD_SECRET,
    reset_password_expires_in: process.env.RESET_PASSWORD_EXPIRES_IN,
    reset_password_link:process.env.RESET_PASSWORD_LINK,
    emailSender:{
        email:process.env.EMAIL,
    app_password:process.env.APP_PASSWORD,
    }
}
