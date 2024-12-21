<script setup lang="ts">
import type { Note } from '@/lib/models'
import { PocketbaseNoteRepository } from '@/lib/repositories/pocketbase-note-repository'
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted, useTemplateRef, watch } from 'vue'
import { Button, InputText } from 'primevue'

const auth = useAuthStore()

const messagesList = useTemplateRef('messagesList')

const messages = ref<Note[]>([])
const input = ref('')

async function fetchMessages() {
  if (!auth.isAuthenticated) {
    messages.value = []
    return
  }

  const repository = new PocketbaseNoteRepository()
  messages.value = await repository.list().then((messages) => messages.reverse())
  scrollToBottom()
}

async function add(message: string) {
  if (!message.trim()) return

  const repository = new PocketbaseNoteRepository()
  const _message = await repository.create({ content: message })

  messages.value = [...messages.value, _message]
  input.value = ''

  scrollToBottom()
}

function scrollToBottom() {
  setTimeout(() => {
    messagesList.value!.scrollTop = messagesList.value!.scrollHeight
  }, 10)
}

onMounted(() => fetchMessages())

watch(
  () => auth.isAuthenticated,
  (isAuthenticated) => fetchMessages(),
)
</script>

<template>
  <main v-if="!auth.isAuthenticated" class="h-dvh grid place-items-center">
    <div>
      <h1 class="font-bold text-8xl tracking-tight">Blink.</h1>
      <p class="text-gray-500 text-lg">You need to be authenticated to continue</p>
      <Button @click="auth.login" class="mt-4"
        ><i class="pi pi-google" /> Continue with Google</Button
      >
    </div>
  </main>

  <main class="flex flex-col mx-auto max-w-screen-sm px-6 py-4 h-dvh" v-if="auth.isAuthenticated">
    <Button @click="auth.logout"><i class="pi pi-sign-out" /> Logout</Button>
    <!-- Messages Section -->
    <section class="flex-1 overflow-auto my-3 scroll-smooth" ref="messagesList">
      <ul class="space-y-4" v-auto-animate="{ duration: 200 }">
        <li
          v-for="message in messages"
          :key="message.id"
          class="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 ease-out duration-300"
        >
          {{ message.content }}
        </li>
      </ul>
    </section>

    <!-- Form Section -->
    <section>
      <form @submit.prevent="add(input)" class="flex gap-2">
        <InputText v-model="input" type="text" placeholder="Dear diary .." class="w-full" />

        <Button
          type="submit"
          class="rounded-md bg-gray-900 px-4 py-2 text-white transition hover:bg-gray-700"
        >
          <i class="pi pi-send" />
          Send
        </Button>
      </form>
    </section>
  </main>
</template>
