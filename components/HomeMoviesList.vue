<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import type { Movie } from '~/types/Movie'
import type { MovieResponse } from '~/types/Response'

const emit = defineEmits<{
  select: [index: number]
}>()

const activeTab = useState<'movies' | 'series'>('activeTab')
const selectedIndex = useState<number>('selectedIndex')

const config = useRuntimeConfig()
const imageUrl = config.public.dbImgBaseUrl as string

const { data: movies, isError: isMovieError, isPending: isMoviePending } = useQuery({
  queryKey: ['movies'],
  queryFn: useFetcher('/trending/movie/day'),
  enabled: computed(() => activeTab.value === 'movies'),
  select: (response: MovieResponse) => response.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    date: movie.release_date,
    poster: `${imageUrl}${movie.poster_path}`,
    backdrop: `${imageUrl}${movie.backdrop_path}`
  })) as Movie[]
})
</script>

<template>
  <section v-if="isMoviePending" class="text-center text-gray-400">
    Loading movies...
  </section>
  <section v-else-if="isMovieError" class="text-center text-red-400">
    Failed to load movies.
  </section>
  <section
    v-else-if="movies"
    class="relative h-[75vh] bg-cover bg-top bg-no-repeat transition-all"
    :style="{ backgroundImage: `url(${movies[selectedIndex].backdrop})` }"
  >
    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
    <div class="absolute bottom-8 left-6 z-10 text-white space-y-2">
      <h2 class="text-4xl font-bold">{{ movies[selectedIndex].title }}</h2>
      <ScnButton asChild variant="ghost">
        <NuxtLink :to="`/movies/${movies[selectedIndex].id}`">Watch Now</NuxtLink>
      </ScnButton>
    </div>
  </section>
  <section v-if="movies" class="py-8">
    <h3 class="text-2xl px-6 font-semibold mb-4">Trending Movies</h3>
    <ScnScrollArea orientation="horizontal" class="w-full whitespace-nowrap">
      <div class="px-6 flex space-x-4">
        <div
          v-for="(movie, index) in movies"
          :key="movie.title"
          @click="emit('select', index)"
          class="w-40 cursor-pointer transition-all rounded-xl overflow-hidden border-2 shadow-sm hover:shadow-md hover:border-red-400"
          :class="{
            'border-red-500': selectedIndex === index,
            'border-muted': selectedIndex !== index
          }"
        >
          <img :src="movie.poster" class="aspect-[3/4] w-full h-60 object-cover" />
        </div>
      </div>
      <ScnScrollBar class="p-2" orientation="horizontal" />
    </ScnScrollArea>
  </section>
</template>
