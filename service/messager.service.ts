import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
export default class MessagerService{

    async createNewMessager(roomId: string){
        try {

            const modelMessager = await db.messager.create({
                data: {
                    roomId,
                    message: {}
                }
            })
            return modelMessager;
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async addContentMessager(content: any, RoomId: any, userId: any){
        try {
           
            const textMessager = await db.textMessager.create({
                data:{
                    content: content,
                    userId: userId,
                    messager: {
                        connect: {
                            roomId : RoomId
                        }
                    }
                }
            })

            return textMessager;
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async getAllMessagerByIdRoom(messageId: any){
        try {
            const messagers = await db.textMessager.findMany({
                where: {
                    messager: {
                        roomId: messageId
                    }
                }
            })
            return messagers;
        } catch (error) {
            return error;
        }
    }
}