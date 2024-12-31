<script setup lang="ts">
import Card from '@/components/Card.vue'
import { defineProps, onMounted, ref } from 'vue'
import type { Preview } from '@/lib/models/preview.ts'

type Props = {
  url: string;
}

const props = defineProps<Props>()
const preview = ref<Preview | null>(null)  // Reactive state to store preview data

async function fetchPreview(url: string): Promise<void> {
  if (!url) return;

  try {
    const response = await fetch(`https://preview.lulzie.online/preview?url=${url}`)
    let result = await response.json()
    result = result?.data?.preview

    preview.value = {
      title: result?.title,
      description: result?.description,
      image: result?.image?.length ? result.image : result.favicon,
      siteName: result?.siteName
    }
  } catch (error) {
    console.error('Failed to fetch preview:', error)
  }
}

onMounted(() => {
  fetchPreview(props.url)
})
</script>

<template>
  <Card>
    <a :href="props.url" target="_blank" rel="noopener noreferrer nofollow" class="flex gap-2">
      <div class="flex-grow">
        <h3 class="text-lg font-semibold mb-2">
          {{ preview?.title ?? preview?.siteName }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ preview?.description }}
        </p>
      </div>

      <div v-if="preview?.image" class="h-24 min-w-24 rounded-lg">
        <img :src="preview.image" alt="Preview image" class="h-full w-full object-cover rounded-lg" />
      </div>
      <div v-else class="h-24 min-w-24 rounded-lg bg-gray-300 animate-pulse"></div>
    </a>
  </Card>
</template>
