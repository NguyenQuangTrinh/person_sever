import { Elysia, t } from "elysia"

export const webSocketController = new Elysia();

webSocketController
    .ws('/ws', {
        body: t.Object({
            message: t.String()
        }),
        message(ws, { message }) {
            console.log(message)
            ws.send({
                message,
                time: Date.now()
            })
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
        },
        message(ws, message) {
            const {
                data: {
                    params: { room, name }
                }
            } = ws

            const a = ws.publish(room, {
                message,
                user: name,
                time: Date.now()
            })
            ws.send(message);
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