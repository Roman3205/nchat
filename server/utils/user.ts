export const users = [] as User[]
export const messages = [] as Chat[]

export function userJoin(user: User) {
    users.push(user)
    return user
}

export function getCurrentUser(id: string) {
    return users.find(user => user.id === id)
}

export function userLeave(id: string) {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

export function getRoomUsers(room: string) {
    return users.filter(user => user.room === room)
}

export function getRoomMessages(room: string) {
    return messages.filter(message => message.room === room)
}

export function newMessage(message: Chat, room: string) {
    messages.push({...message, room})
    return true
}