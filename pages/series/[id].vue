<script setup lang="ts">
const route = useRoute()
const embedUrl = computed(() => {
  const id = route.params.id
  const season = route.query.season
  const episode = route.query.episode 
  return `https://embed.su/embed/tv/${id}/${season}/${episode}`
})
</script>

<template>
  <div class="bg-black text-white min-h-screen">
    <header class="flex items-center justify-between px-6 py-4">
    <NuxtLink
      to="/"
      class="text-3xl font-bold"
    >
      MovieHub
    </NuxtLink>
    </header>

    <div class="px-8 w-screen h-screen">
      <iframe
        :src="embedUrl"
        class="w-full h-full"
        frameborder="0"
        allowfullscreen
        allow="autoplay; encrypted-media; fullscreen"
      ></iframe>
    </div>
  </div>
</template>
