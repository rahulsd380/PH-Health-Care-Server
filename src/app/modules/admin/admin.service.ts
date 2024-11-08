import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchableFields } from "./admin.constants";
import { paginationHelpers } from './../../../helpers/paginationHelpers';
import { prisma } from "../../../shared/prisma";



const getAllAdmins = async (params: any, options: any) => {
    const { page, limit, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andConditions: Prisma.AdminWhereInput[] = [];


    // [
    //     {
    //         name: {
    //             contains: params.searchTerm,
    //             mode: 'insensitive'
    //         }
    //     },
    //     {
    //         email: {
    //             contains: params.searchTerm,
    //             mode: 'insensitive'
    //         }
    //     }
    // ]




    if (params.searchTerm) {
        andConditions.push(
            {
                OR: adminSearchableFields.map(field => ({
                    [field]: {
                        contains: params.searchTerm,
                        mode: 'insensitive'
                    }
                }))
            }
        )
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    };

    andConditions.push({
        isDeleted : false
    })

    const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }
    const result = await prisma.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = await prisma.admin.count({
        where : whereConditions
    })
    return {
        meta : {
            page,
            limit,
            total
        },
        data : result
    };

};

const getAdminById = async (id:string) : Promise<Admin | null> => {
    const result = await prisma.admin.findUnique({
        where : {
            id,
            isDeleted : false
        }
    });
    return result;
};

const updateAdminData = async (id:string, data : Partial<Admin>): Promise<Admin> => {
    const isAdminExists = await prisma.admin.findUnique({
        where : {
            id,
            isDeleted : false
        }
    });
    if(!isAdminExists){
        throw new Error("Admin not found");
    }
    const result = await prisma.admin.update({
        where : {
            id,
            isDeleted : false
        },
        data
    });
    return result;
};

const deleteAdmin = async (id:string): Promise<Admin | null> => {
    const result = await prisma.$transaction(async(transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where : {
                id
            }
        });

        const userDeletedData = await transactionClient.user.delete({
            where : {
                email : adminDeletedData.email
            }
        });

        return adminDeletedData
    });

    return result;
};

const softDeleteAdmin = async (id:string): Promise<Admin | null> => {
    const result = await prisma.$transaction(async(transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where : {
                id
            },
            data : {
                isDeleted : true
            }
        });

        const userDeletedData = await transactionClient.user.update({
            where : {
                email : adminDeletedData.email
            },
            data : {
                status : UserStatus.BLOCKED
            }
        });

        return adminDeletedData
    });

    return result;
};


export const AdminServices = {
    getAllAdmins,
    getAdminById,
    updateAdminData,
    deleteAdmin,
    softDeleteAdmin
}