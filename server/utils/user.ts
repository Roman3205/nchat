export const getUsers = async (): Promise<User[]> => {
    let users = await useStorage('storage').getItem('users') as User[] || []
    return users
}

export const getMessages = async (): Promise<Chat[]> => {
    let messages = await useStorage('storage').getItem('messages') as Chat[] || []
    return messages
}

export async function userJoin(user: User) {
    let users = await getUsers()
    users = [...users, user]
    await useStorage('storage').setItem('users', users)
    return user
}

export async function getCurrentUser(id: string) {
    let users = await getUsers()
    return users.find(user => user.id === id)
}

export async function userLeave(id: string) {
    let users = await getUsers()
    const index = users?.findIndex(user => user.id === id)

    if (index !== -1) {
        let user = users.splice(index, 1)[0]
        await useStorage('storage').setItem('users', users)
        return user
    }
}

export async function getRoomUsers(room: string) {
    let users = await getUsers()
    return users?.filter(user => user.room === room)
}

export async function getRoomMessages(room: string) {
    let messages = await getMessages()
    return messages?.filter(message => message.room === room)
}

export async function newMessage(message: Chat, room: string) {
    let messages = await getMessages()
    messages = [...messages, {...message, room}]
    await useStorage('storage').setItem('messages', messages)
    return true
}