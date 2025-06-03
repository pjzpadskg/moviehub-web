<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import type { Movie } from '~/types/Movie'
import type { Series } from '~/types/Series'
import type { MovieResponse } from '~/types/Response'
import type { SeriesResponse } from '~/types/Response'

const activeTab = useState<'movies' | 'series'>('activeTab', () => 'movies')
const config = useRuntimeConfig()
const imageUrl = config.public.dbImgBaseUrl as string
const selectedIndex = useState<number>('selectedIndex', () => 0)
const selectItem = (index: number) => {
  selectedIndex.value = index
}

watch(activeTab, () => selectedIndex.value = 0)

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

const { data: series, isError: isSeriesError, isPending: isSeriesPending } = useQuery({
  queryKey: ['series'],
  queryFn: useFetcher('/trending/tv/day'),
  enabled: computed(() => activeTab.value === 'series'),
  select: (response: SeriesResponse) => response.results.map((series) => ({
    id: series.id,
    title: series.name,
    overview: series.overview,
    date: series.first_air_date,
    poster: `${imageUrl}${series.poster_path}`,
    backdrop: `${imageUrl}${series.backdrop_path}`
  })) as Series[]
})
</script>

<template>
  <div class="bg-black text-white min-h-screen">
    <header class="flex items-center justify-between px-6 py-4 bg-black shadow-md">
      <h1 class="text-2xl font-bold">MovieHub</h1>
    </header>

    <ScnTabs v-model="activeTab" class="p-6">
      <ScnTabsList>
        <ScnTabsTrigger value="movies">Movies</ScnTabsTrigger>
        <ScnTabsTrigger value="series">Series</ScnTabsTrigger>
      </ScnTabsList>
      <ScnTabsContent value="movies">
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
        <section v-if="movies" class="px-6 py-8">
          <h3 class="text-2xl font-semibold mb-4">Trending Movies</h3>
          <ScnScrollArea orientation="horizontal" class="w-full whitespace-nowrap">
            <div class="flex space-x-4">
              <div
                v-for="(movie, index) in movies"
                :key="movie.title"
                @click="selectItem(index)"
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
      </ScnTabsContent>
      <ScnTabsContent value="series">
        <section v-if="isSeriesPending" class="text-center text-gray-400">
          Loading series...
        </section>
        <section v-else-if="isSeriesError" class="text-center text-red-400">
          Failed to load series.
        </section>

        <section
          v-else-if="series"
          class="relative h-[75vh] bg-cover bg-top bg-no-repeat transition-all"
          :style="{ backgroundImage: `url(${series[selectedIndex].backdrop})` }"
        >
          <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div class="absolute bottom-8 left-6 z-10 text-white space-y-2">
            <h2 class="text-4xl font-bold">{{ series[selectedIndex].title }}</h2>
            <ScnButton asChild variant="ghost">
              <NuxtLink :to="`/series/${series[selectedIndex].id}`">Watch Now</NuxtLink>
            </ScnButton>
          </div>
        </section>

        <section v-if="series" class="px-6 py-8">
          <h3 class="text-2xl font-semibold mb-4">Trending Series</h3>
          <ScnScrollArea orientation="horizontal" class="w-full whitespace-nowrap">
            <div class="flex space-x-4">
              <div
                v-for="(s, index) in series"
                :key="s.title"
                @click="selectItem(index)"
                class="w-40 cursor-pointer transition-all rounded-xl overflow-hidden border-2 shadow-sm hover:shadow-md hover:border-blue-400"
                :class="{
                  'border-blue-500': selectedIndex === index,
                  'border-muted': selectedIndex !== index
                }"
              >
                <img :src="s.poster" class="aspect-[3/4] w-full h-60 object-cover" />
              </div>
            </div>
            <ScnScrollBar class="p-2" orientation="horizontal" />
          </ScnScrollArea>
        </section>
      </ScnTabsContent>
    </ScnTabs>
  </div>
</template>
