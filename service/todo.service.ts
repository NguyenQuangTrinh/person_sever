import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
export default class TodoService {

    // get todo by id user
    async getTodoByIdUser(idUser: string) {
        const todo = await db.todoList.findMany({
            where: {
                idUser: idUser
            }
        })
        return todo;
    }

    // create todo list by id user
    async createTodoList(idUser: any, title: any, description: any, tab: any) {
        const todo = await db.todoList.create({
            data: {
                idUser, title, description, tab
            }
        })
        return todo;
    }
    // get todo by iduser and id todo
    async getTodoById(id: any) {
        const todo = await db.todoList.findUnique({
            where: {
                id: id
            }
        })
        return todo;
    }

    // update todo 
    async updateTodoById(id: any, body: any) {
        try {
            const { title, description, tab } = body
            const todo = await db.todoList.update({
                where: {
                    id: id,
                },
                data: {
                    title, description, tab
                }
            })
            return todo;
        } catch (error) {
            return error;
        }

    }
}