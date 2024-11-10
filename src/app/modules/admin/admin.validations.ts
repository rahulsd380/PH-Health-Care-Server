import { z } from "zod"

const updateAdminInfo = z.object({
    body : z.object({
        name : z.string().optional(),
        contactNumber : z.string().optional()
    })
})

export const adminValidationsSchemas = {
    updateAdminInfo,
}