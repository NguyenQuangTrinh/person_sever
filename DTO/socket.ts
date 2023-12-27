
export interface JoinRoomSocket{
    join: string,
    idUser: string,
    message: string
    data: {
        idRoom: string,
    }
}

export interface MessageSender{
    idUser: string,
    message: string
}