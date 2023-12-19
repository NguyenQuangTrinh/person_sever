import Elysia, { t } from "elysia";
import TodoService from "../service/todo.service";


export const todoController = new Elysia();
const todoService = new TodoService()

todoController.group("v1/todo", todoController => todoController
    .get("getByUserId/:idUser", async ({ params }) => {
        const id = params.idUser
        return await todoService.getTodoByIdUser(id);
    }, {detail: { tags: ['Todo'] }})
    .model({
        todo: t.Object({
            title: t.String(),
            description: t.String(),
            idUser: t.String(),
            tab: t.String()
        })
    })
    .post("createTodoByUserId", async ({ body }) => {
        try {
            const { title, description, idUser, tab }: any = body;
            const todo = await todoService.createTodoList(idUser, title, description, tab);

            return todo;
        } catch (error) {
            return error;
        }
    }, { body: 'todo', detail: { tags: ['Todo'] } })
    .get('getTodoById/:id', async ({params})=>{
        try {
            const todo = await todoService.getTodoById(params.id);
            return todo;
        } catch (error) {
            return error
        }
    },{detail: { tags: ['Todo'] }})
    .put('updateTodoById/:id', async ({params, body, set}) => {
        try{
            const todo = await todoService.updateTodoById(params.id, body);
            return todo;
        }catch (e){
            set.status = 400
            return e;
        }
    },{ body: 'todo', detail: { tags: ['Todo'] } })
)
