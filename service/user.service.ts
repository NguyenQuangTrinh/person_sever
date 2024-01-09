import { PrismaClient } from "@prisma/client";
import { createCustomUUID, hashPassword } from "../helpers";
import MessagerService from "./messager.service";

const db = new PrismaClient();
const messagerService = new MessagerService();
export default class UserService {

    async getAllUser() {
        return await db.user.findMany();
    }

    async createUser(email: any, passwords: any, name: any) {
        try {
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
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findUserByEmail(email: string) {
        return await db.user.findUnique({
            where: { email }
        })
    }

    async getUserById(id: string){
        try{
            return await db.user.findUnique({
                where: {id},
                select:{
                    id: true,
                    email: true,
                    name: true,
                    listfriends: true,
                    CreateAt: true,
                    UpdateAt: true
                }
            })
        }catch(e){
            return e;
        }
    }

    async addFriend(idUserNeedAdd: string, userId: string) {
        try {
            const room = createCustomUUID(idUserNeedAdd, userId);
            const friend = await db.user.findUnique({
                where: {
                    id: idUserNeedAdd
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    CreateAt: true
                }
            });

            const friendUser = await db.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    CreateAt: true
                }
            });
            if(friend && friendUser){
                const updatedUser = await db.user.update({
                    where: { id: userId },
                    data: {
                        listfriends: {
                            push: {friend, room}
                        }
                    }
                })
                await db.user.update({
                    where: {id: idUserNeedAdd},
                    data: {
                        listfriends: {
                            push: {friend: friendUser, room}
                        }
                    }
                })
                await messagerService.createNewMessager(room)
                return updatedUser;
            }else{
                return {error: "user not found"}
            }
          
        } catch (error) {
            return error
        }

    }

}