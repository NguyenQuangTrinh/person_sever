import Elysia from "elysia";
import MessagerService from "../service/messager.service";

const messagerService = new MessagerService;
export const messagerController = new Elysia()

messagerController.group("/v1/messager",
    messagerController => messagerController
    .get("/getAllMessagerByIdRoom/:roomId", async ({params}) => {
        try {
            const roomId = params.roomId;
            const messagers = await messagerService.getAllMessagerByIdRoom(roomId);           
            return messagers 
        } catch (error) {
            return error;
        }
    })
    .get("/createMessagerRoom/:roomId", async ({params}) => {
        try {
            const roomId = params.roomId;
            const Messager = await messagerService.createNewMessager(roomId);
            return Messager;
        } catch (error) {
            return error;
        }
    })
    
)