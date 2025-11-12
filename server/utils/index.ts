import { Server, type Socket, type ServerOptions } from "socket.io";
import moment from "moment";
import type { H3Event } from 'h3';
import { getRoomMessages, getRoomUsers, userJoin, userLeave, newMessage } from "./user";

const options: Partial<ServerOptions> = {
    path: '/api/socket.io',
    serveClient: false
}

export const io = new Server(options)

const botName = 'Admin'
export function initSocket(event: H3Event) {
    io.attach(event.node.res.socket?.server)
    io.on('connection', (socket: Socket) => {
        socket.on('roomJoin', async (payload: User) => {
            const user = await userJoin({...payload, id: socket.id})
            socket.join(user.room)
            socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`))
            io.to(user.room).emit('roomMessages', {onlyFor: user.username, messages: await getRoomMessages(user.room)})
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: await getRoomUsers(user.room)
            })
        })
        socket.on('chatMessage', async (payload: string) => {
            const user = await getCurrentUser(socket.id)
            if (user) {
                const message = formatMessage(user.username, payload)
                await newMessage(formatMessage(user.username, payload), user.room)
                io.to(user.room).emit('message', message)
            }
        })
        socket.on('disconnect', async () => {
            const user = await userLeave(socket.id)
            if (user) {
                io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: await getRoomUsers(user.room)
                })
            }
        })
    })
}

export function formatMessage(username: string, text: string) {
    return {
        username,text,time:moment().format('h:mm a')
    }
}