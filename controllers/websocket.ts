import { Elysia, t } from "elysia"

export const webSocketController = new Elysia();

webSocketController
    .ws('/ws', {
        message(ws, message: any) {
            if (message.type == "join") {
                console.log(message)
                ws.subscribe(message.data.idRoom).publish(message.data.idRoom, {
                    message: `${message.idUser} has entered the room`,
                    user: '[SYSTEM]',
                    time: Date.now()
                })
                ws.send(message);
            } else if (message.type == "message") {
                ws.publish(message.data.idRoom, {
                    message
                })
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