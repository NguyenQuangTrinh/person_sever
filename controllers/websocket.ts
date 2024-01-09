import { Elysia, t } from "elysia"
import UserService from "../service/user.service";
import { createCustomUUID } from "../helpers";
import MessagerService from "../service/messager.service";

export const webSocketController = new Elysia();
const userService = new UserService();
const messagerService = new MessagerService();

webSocketController
    .ws('/ws', {
        async message(ws, message: any) {
            if (message.type == "JOIN_ROOM") {
                const user: any = await userService.getUserById(message.data.id);
                if (user) {
                    user?.listfriends.map((item: any) => {
                        ws.subscribe(item.room).publish(item.room, {
                            message: `${item.room} has entered the room`,
                            user: '[SYSTEM]',
                            time: Date.now()
                        })
                    })
                }
                ws.send(message);

            } else if (message.type == "MESSAGE") {
                ws.publish(message.room, {
                    message
                })
                await messagerService.addContentMessager(message.content, message.room, message.userId)
                ws.send({ message });
            }
        }
    })
    .ws("ws/:room/:name", {
        open(ws) {
            const {
                data: {
                    params: { room, name }
                }
            } = ws

            ws.subscribe(room).publish(room, {
                message: `${name} has entered the room`,
                user: '[SYSTEM]',
                time: Date.now()
            })
            // console.log(ws);
        },
        message(ws, message) {
            const {
                data: {
                    params: { room, name }
                }
            } = ws

            ws.publish(room, {
                message,
                user: name,
                time: Date.now()
            })
            // ws.send({
            //     message,
            //     room: room,
            //     name: name
            // });
        },
        close(ws) {
            const {
                data: {
                    params: { room, name }
                }
            } = ws

            ws.publish(room, {
                message: `${name} has leave the room`,
                user: '[SYSTEM]',
                time: Date.now()
            })
        }
    })