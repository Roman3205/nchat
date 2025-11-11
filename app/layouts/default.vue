<template>
  <div class="min-h-screen">
    <div class="z-10 backdrop-blur-md w-full sticky top-0 flex justify-between p-5">
        <NuxtLink class="flex cursor-pointer transition duration-300 hover:opacity-80 items-center gap-x-2" to="/">
          <UIcon
            name="lucide:message-square-text"
            class="w-6 h-6 font-semibold"
          />
          <div class="text-primary font-semibold text-center text-xl">NChat</div>
        </NuxtLink>
        <UColorModeSwitch />
    </div>
    
    <UMain>
        <slot />
    </UMain>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>