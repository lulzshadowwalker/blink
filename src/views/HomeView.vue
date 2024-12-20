<script setup lang="ts">
import type { Note } from '@/lib/models'
import { PocketbaseNoteRepository } from '@/lib/repositories/pocketbase-note-repository'
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted, useTemplateRef, watch } from 'vue'

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
  <main v-if="!auth.isAuthenticated" class="h-screen grid place-items-center">
    <div>
      <p>You need to authenticate to see the messages</p>
      <button @click="auth.login">Authenticate</button>
    </div>
  </main>

  <main
    class="flex flex-col mx-auto max-w-screen-sm px-6 py-8 h-screen"
    v-if="auth.isAuthenticated"
  >
    <button @click="auth.logout">Logout</button>
    <!-- Messages Section -->
    <section class="flex-1 overflow-auto mb-6 scroll-smooth" ref="messagesList">
      <ul class="space-y-4" v-auto-animate="{ duration: 200 }">
        <li
          v-for="message in messages"
          :key="message.id"
          class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          {{ message.content }}
        </li>
      </ul>
    </section>

    <!-- Form Section -->
    <section>
      <form @submit.prevent="add(input)" class="flex gap-2">
        <input
          type="text"
          placeholder="Write a new message"
          v-model="input"
          class="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:ring focus:ring-gray-300 outline-none"
          aria-label="New message"
        />
        <button
          type="submit"
          class="rounded-md bg-gray-900 px-4 py-2 text-white transition hover:bg-gray-700"
        >
          Add
        </button>
      </form>
    </section>
  </main>
</template>
