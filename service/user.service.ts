import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../helpers";

const db = new PrismaClient();
export default class UserService {

    async getAllUser() {
        return await db.user.findMany();
    }

    async createUser(email: any, passwords: any, name: any) {
        const password = hashPassword(passwords)
        const user = await db.user.create({
            data: {
                email, password, name
            },
            select: {
                id: true,
                email: true
            }
        })

        return user;
    }

    async findUserByEmail(email: string) {
        return await db.user.findUnique({
            where: { email }
        })
    }

}