import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
export default class CollectionService{
    async createCollection(image: any, idUser: any, category: any, name: any){
        const collection = db.collection.create({
            data: {
                idUser, image: [image], category, name
            }
        })
        return collection;
    }
}