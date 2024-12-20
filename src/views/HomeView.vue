<script setup lang="ts">
import type { Note } from '@/lib/models'
import { PocketbaseNoteRepository } from '@/lib/repositories/pocketbase-note-repository'
import { ref, onMounted, useTemplateRef } from 'vue'

const messagesList = useTemplateRef('messagesList')

const messages = ref<Note[]>([])
const input = ref('')

async function fetchMessages() {
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

onMounted(() => {
  fetchMessages()
})
</script>

<template>
  <main class="flex flex-col mx-auto max-w-screen-sm px-6 py-8 h-screen">
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
