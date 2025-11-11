<template>
  <div class="flex h-screen justify-center items-center">
    <UCard class="max-w-[600px] w-[500px] mx-auto" :ui="{body: {padding: 'p-5 sm:p-0'}}">
        <template #header>
            <div class="flex items-center justify-center gap-x-3 text-primary">
                <UIcon name="lucide:message-square-text" class="w-9 h-9 font-semibold" />
                <div class="text-primary font-semibold text-center text-3xl">NChat</div>
            </div>
        </template>
        <UForm :state="state" @submit="onSubmit" class="flex flex-col gap-6">
            <UFormField label="Username" name="username">
                <UInput v-model="state.username" class="w-full" placeholder="Enter your name" />
            </UFormField>
            <UFormField label="Room" name="room">
                <USelect v-model="state.room" :options="rooms" class="w-full" />
            </UFormField>
            <UButton type="submit" size="xl" block :disabled="!state.room || !state.username">Join chat</UButton>
        </UForm>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';

const rooms = ['nuxt installation', 'nuxt guide', 'nuxt api', 'nuxt examples']

const state = reactive({
    username: '',
    room: rooms[0]
})

const onSubmit = async (e: FormSubmitEvent<any>) => {
    navigateTo(`/chat?username=${state.username}&room=${state.room}`)
}
</script>

<style>

</style>