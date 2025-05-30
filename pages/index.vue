<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

interface RawShow {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
}

interface ShowResponse {
  page: number
  total_pages: number
  total_results: number
  results: RawShow[]
}

interface Show {
  id: number
  title: string
  overview: string
  poster: string
  backdrop: string
}

const config = useRuntimeConfig()
const imageUrl = config.public.dbImgBaseUrl as string
const { data: shows, suspense, isError, isPending } = useQuery({
  queryKey: ['shows'],
  queryFn: useFetcher('/trending/movie/day'),
  select: (response: ShowResponse) => response.results.map((show) => ({
    id: show.id,
    title: show.title,
    overview: show.overview,
    poster: `${imageUrl}${show.poster_path}`,
    backdrop: `${imageUrl}${show.backdrop_path}`
  })) as Show[]
})
await suspense()


const selectedShowIndex = useState<number>('selectedShow', () => 0)
const selectShow = (index: number) => {
  selectedShowIndex.value = index
}

// make another page for movie
// show movie video: https://player.autoembed.cc/embed/movie/{id}
// do for series
</script>

<template>
  <div class="bg-black text-white min-h-screen">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-4 bg-black shadow-md">
      <h1 class="text-2xl font-bold">MovieHub</h1>
      <nav class="space-x-4">
        <ScnButton variant="ghost">Series</ScnButton>
        <ScnButton variant="ghost">Movies</ScnButton>
      </nav>
    </header>

    <section v-if="isPending" class="p-6 text-center text-gray-400">
      Loading ...
    </section>
    <section v-else-if="isError" class="p-6 text-center text-red-400">
      An error has occurred.
    </section>

    <!-- Main Featured Banner + Trending Scroll Area -->
    <section
      v-else-if="shows"
      class="relative h-[75vh] bg-cover bg-top bg-no-repeat transition-all"
      :style="{ backgroundImage: `url(${shows[selectedShowIndex].backdrop})` }"
    >
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div class="absolute bottom-8 left-6 z-10 text-white space-y-2">
        <h2 class="text-4xl font-bold">{{ shows[selectedShowIndex].title }}</h2>
        <ScnButton asChild variant="ghost">
          <NuxtLink :to="`/movies/${shows[selectedShowIndex].id}`">Watch Now</NuxtLink>
        </ScnButton>
      </div>
    </section>

    <!-- Trending Scroll Area -->
    <section v-if="shows" class="px-6 py-8">
      <h3 class="text-2xl font-semibold mb-4">Trending</h3>
      <ScnScrollArea orientation="horizontal" class="w-full whitespace-nowrap">
        <div class="flex space-x-4">
          <div
            v-for="(show, index) in shows"
            :key="show.title"
            @click="selectShow(index)"
            class="w-40 cursor-pointer transition-all rounded-xl overflow-hidden border-2 shadow-sm hover:shadow-md hover:border-red-400"
            :class="{
              'border-red-500': selectedShowIndex === index,
              'border-muted': selectedShowIndex !== index
            }"
          >
            <img :src="show.poster" class="aspect-[3/4] w-full h-60 object-cover" />
          </div>
        </div>
        <ScnScrollBar class="p-2" orientation="horizontal" />
      </ScnScrollArea>
    </section>
  </div>
</template>
