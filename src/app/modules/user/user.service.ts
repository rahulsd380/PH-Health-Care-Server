import { Prisma, User, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt"
import { prisma } from "../../../shared/prisma";
import { sendImageToCloudinary } from "../../../helpers/uploadFile";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { userSearchAbleFields } from "./user.constants";

const createAdmin = async (req: any) => {
    const file = req.file;
    if(file){
        const uploadToCloudinary = await sendImageToCloudinary("name", file.path);
        req.body.admin = uploadToCloudinary.secure_url;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        })

        return createdAdminData
    })
    console.log(result);
    return result
};

const createDoctor = async (req: any) => {
    const file = req.file;
    if(file){
        const uploadToCloudinary = await sendImageToCloudinary("name", file.path);
        req.body.doctor = uploadToCloudinary.secure_url;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        })

        return createdDoctorData
    })
    return result
};

const getAllFromDB = async (params: any, options: any) => {
    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.UserWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditons: Prisma.UserWhereInput = andCondions.length > 0 ? { AND: andCondions } : {};

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            // patient: true,
            doctor: true
        }
    });

    const total = await prisma.user.count({
        where: whereConditons
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
};

const getMyProfile = async (user:any) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where : {
            email : user.email
        },
        select : {
            id:true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt:true

        }
    });

    let profileData;
    if(userInfo.role === UserRole.ADMIN){
        profileData = await prisma.admin.findUniqueOrThrow({
            where :{
                email : userInfo.email
            }
        })
    } else if(userInfo.role === UserRole.SUPER_ADMIN){
        profileData = await prisma.admin.findUniqueOrThrow({
            where :{
                email : userInfo.email
            }
        })
    } else if(userInfo.role === UserRole.DOCTOR){
        profileData = await prisma.doctor.findUniqueOrThrow({
            where :{
                email : userInfo.email
            }
        })
    }
    // else if(userInfo.role === UserRole.PATIENT){
    //     profileData = await prisma.patient.findUniqueOrThrow({
    //         where :{
    //             email : userInfo.email
    //         }
    //     })
    // }

    return {...userInfo, ...profileData};
};

const updateProfile = async (user, payload) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where : {
            email : user.email
        }
    });

    let profileData;
    if(userInfo.role === UserRole.ADMIN){
        profileData = await prisma.admin.update({
            where :{
                email : userInfo.email
            },
            data : payload
        })
    } else if(userInfo.role === UserRole.SUPER_ADMIN){
        profileData = await prisma.admin.update({
            where :{
                email : userInfo.email
            },
            data : payload
        })
    } else if(userInfo.role === UserRole.DOCTOR){
        profileData = await prisma.doctor.update({
            where :{
                email : userInfo.email
            },
            data : payload
        })
    }
    // else if(userInfo.role === UserRole.PATIENT){
    //     profileData = await prisma.patient.update({
    //         where :{
    //             email : userInfo.email
    //         },
                // data : payload
    //     })
    // }

    return {...userInfo, ...profileData};
};

export const UserServices = {
    createAdmin,
    createDoctor,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateProfile,
}