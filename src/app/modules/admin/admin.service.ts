import { Admin, Prisma } from "@prisma/client";
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
    }

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

const getAdminById = async (id:string) => {
    const result = await prisma.admin.findUnique({
        where : {
            id
        }
    });
    return result;
};

const updateAdminData = async (id:string, data : Partial<Admin>) => {
    const result = await prisma.admin.update({
        where : {
            id
        },
        data
    });
    return result;
};


export const AdminServices = {
    getAllAdmins,
    getAdminById,
    updateAdminData,
}