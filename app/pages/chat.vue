<template>
  <div class="p-5 min-h-[calc(100vh-65px)] flex flex-col">
    <div class="flex md:flex-row flex-col gap-3">
      <div class="bg-slate-100 dark:bg-gray-800 rounded-lg py-4 px-6">
        <div class="mb-4">
          <div class="flex items-center gap-x-2 mb-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-600">
            <UIcon
              name="i-heroicons-chat-bubble-bottom-center-text"
              class="w-6 h-6 font-semibold"
            />
            <div class="text-base">Room Name</div>
          </div>
          <div class="text-gray-400 mb-2 capitalize text-base ml-2">
            {{ currentRoom }}
          </div>
        </div>
        <div>
          <div class="flex items-center gap-x-2 mb-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-600">
            <UIcon name="i-heroicons-user-group" class="w-6 h-6 font-semibold" />
            <div class="text-base">Users</div>
          </div>
          <div
            v-for="(user, i) in users"
            :key="i"
            class="text-gray-400 mb-2 capitalize text-base ml-2"
            :class="{ 'border-b border-primary': user.username.toLowerCase() === String(route.query.username).toLowerCase() }"
          >
            {{ user.username }}
          </div>
        </div>
      </div>
      <div class="overflow-y-auto max-h-[615px] p-4 md:p-8 flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
        <div
          class="bg-transparent w-full mb-3 flex"
          v-for="(chat, i) in chats"
          :key="i"
          :class="[
              chat.username === 'Admin' ? 'justify-center' : chat.username.toLowerCase() === String(route.query.username).toLowerCase() ? 'justify-end' : 'justify-start',
          ]"
        >
          <div
            class="px-6 py-2 w-1/2 rounded-md mb-3"
            :class="[
              chat.username === 'Admin' ? 'bg-amber-200 dark:bg-amber-800' : chat.username.toLowerCase() === String(route.query.username).toLowerCase() ? 'bg-primary/20' : 'bg-green-300 dark:bg-green-800',
            ]"
          >
            <div class="flex items-center gap-x-3">
              <div class="text-xs text-primary font-semibold">{{ chat.username }}</div>
              <div class="text-xs">{{ chat.time }}</div>
            </div>
            <div class="mt-1 text-base">
              {{ chat.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
      <form @submit.prevent="sendMessage" class="w-full mt-5">
        <UInput
          v-model="message"
          placeholder="Enter your message"
          class="w-full"
          size="xl"
          :ui="{ padding: 'px-6 py-10' }"
        >
          <template #trailing>
            <UButton
              trailing-icon="i-heroicons-paper-airplane"
              size="md"
              color="primary"
              variant="solid"
              :trailing="false"
              label="Send"
              type="submit"
            />
          </template>
        </UInput>
      </form>

  </div>
</template>

<script setup lang="ts">
import { io, type Socket } from 'socket.io-client'

const route = useRoute()

const message = ref('')
const chats = ref<Chat[]>([])
const users = ref<User[]>([])
const socket = ref<Socket>()
const currentRoom = ref('')

const sendMessage = async () => {
    socket.value?.emit('chatMessage', message.value)
    await nextTick(() => message.value = '')
}

onMounted(() => {
    const {username, room} = route.query as Partial<Chat>
    if (!username || !room) {
        navigateTo('/')
    }

    socket.value = io({
        path: '/api/socket.io'
    })

    socket.value.emit('roomJoin', {username, room})
    socket.value.on('message', (payload: Chat) => {
        chats.value.push(payload)
    })

    socket.value.on('roomUsers', (payload: {room: string, users: User[]}) => {
        currentRoom.value = payload.room
        users.value = payload.users
    })

    socket.value.on('roomMessages', (payload: {onlyFor: string, messages: Chat[]}) => {
        if (String(route.query.username).toLowerCase() === payload.onlyFor.toLowerCase()) {
            console.log(111)
            chats.value = payload.messages
        }
    })
})

onBeforeUnmount(() => {
    socket.value?.disconnect()
})
</script>

<style scoped></style>