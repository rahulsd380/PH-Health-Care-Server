import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createAdmin = async (req:Request, res:Response) => {
    console.log(req.body);
    const result =await UserServices.createAdmin(req.body);
    res.send(result);
};

export const UserControllers = {
    createAdmin,
}
