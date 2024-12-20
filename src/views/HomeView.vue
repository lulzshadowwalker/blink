<script setup lang="ts">
import type { Note } from '@/lib/models'
import { PocketbaseNoteRepository } from '@/lib/repositories/pocketbase-note-repository'
import { ref, onMounted } from 'vue'

const messages = ref<Note[]>([])

const input = ref('')

async function fetchMessages() {
  const repository = new PocketbaseNoteRepository()
  messages.value = await repository.list()
}

async function add(message: string) {
  const repository = new PocketbaseNoteRepository()
  const _message = await repository.create({ content: message })

  messages.value = [...messages.value, _message]

  input.value = ''
}

onMounted(() => {
  fetchMessages()
})
</script>

<template>
  <main>
    <h1>Blink</h1>
    <form @submit.prevent="add(input)">
      <input type="text" placeholder="Write a new message" v-model="input" />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="message in messages" :key="message.id">{{ message.content }}</li>
    </ul>
  </main>
</template>
