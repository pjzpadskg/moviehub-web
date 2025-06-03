<script setup lang="ts">
const route = useRoute()
const embedUrl = computed(() => `https://embed.su/embed/movie/${route.params.id}`)
</script>

<template>
  <div class="h-screen w-screen bg-black text-white flex items-center justify-center">
    <div class="w-screen h-screen">
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
