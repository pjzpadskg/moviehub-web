<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import type { Show, RawShow } from '~/types/Show'
import type { ShowResponse } from '~/types/Response'

const debouncedQuery = defineModel<string>({ required: true })

const config = useRuntimeConfig()
const imageUrl = config.public.dbImgBaseUrl as string

const activeTab = useState<'movies' | 'series'>('activeTab')
const page = ref(1)

const activeTabAsType = computed(() => {
  return activeTab.value === 'movies' ? 'movie' : 'tv'
})

const getTitle = (show: RawShow) => {
  return activeTabAsType.value === 'movie' ? show.title : show.name
}

const getDate = (show: RawShow) => {
  return activeTabAsType.value === 'movie' ? show.release_date : show.first_air_date
}

const getImageLink = (link?: string) => {
  return link ? `${imageUrl}${link}` : '/poster-placeholder.png'
}

const {
  data: searchResults,
  isError: isSearchingError,
  isPending: isSearchingPending,
  error
} = useQuery({
  queryKey: ['searchResults', debouncedQuery, activeTab],
  queryFn: () => useFetcher(
    `/search/multi?query=${debouncedQuery.value}&page=${page.value}`
  )(),
  select: (response: ShowResponse) => response.results.map((show: RawShow) => ({
    id: show.id,
    type: show.media_type,
    title: getTitle(show) || '',
    date: getDate(show) || '',
    poster: getImageLink(show.poster_path),
    backdrop: getImageLink(show.backdrop_path)
  })).filter((show: Show) => show.type === activeTabAsType.value) as Show[]
})
</script>

<template>
  <div v-if="isSearchingPending">Loading...</div>
  <div v-else-if="isSearchingError">Failed to load movies.</div>
  <div 
    v-else-if="searchResults?.length"
    class="px-4 pb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
  >
    <div
      v-for="show in searchResults"
      :key="show.id"
      class="group cursor-pointer relative rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
    >
      <img
        :src="show.poster"
        :alt="show.title"
        class="w-full h-full object-cover aspect-[2/3]"
      />
      <div
        class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white px-2 py-1 text-xs"
      >
        <p class="font-medium truncate">{{ show.title }}</p>
        <p class="text-gray-300 text-[10px]">{{ show.date }}</p>
      </div>
    </div>
  </div>
  <div v-else>No results found.</div>
</template>