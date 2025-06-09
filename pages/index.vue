<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { refDebounced } from '@vueuse/core'
import type { Show } from '~/types/Show'
import type { ShowResponse } from '~/types/Response'

const config = useRuntimeConfig()
const imageUrl = config.public.dbImgBaseUrl as string

const activeTab = useState<'movies' | 'series'>('activeTab', () => 'movies')
const selectedIndex = useState<number>('selectedIndex', () => 0)
const selectItem = (index: number) => {
  selectedIndex.value = index
}

const activeTabAsType = computed(() => {
  return activeTab.value === 'movies' ? 'movie' : 'tv'
})

watch(activeTab, () => selectedIndex.value = 0)

const query = ref('')
const debouncedQuery = refDebounced(query, 300)
const page = ref(1)
const searchUrl = computed(() => {
  return activeTab.value === 'movies'
    ? `/search/movie?query=${debouncedQuery.value}&page=${page.value}`
    : `/search/tv?query=${debouncedQuery.value}&page=${page.value}`
})

const isSearching = computed(() => debouncedQuery.value.trim().length > 0)

const {
  data: searchResults,
  isError: isSearchingError,
  isPending: isSearchingPending
} = useQuery({
  queryKey: ['searchResults'],
  queryFn: useFetcher(searchUrl.value),
  enabled: isSearching,
  select: (response: ShowResponse) => response.results.map((show) => ({
    id: show.id,
    type: show.type,
    title: show.title,
    date: show.release_date,
    poster: `${imageUrl}${show.poster_path}`,
    backdrop: `${imageUrl}${show.backdrop_path}`
  })).filter((show) => show.type === activeTabAsType.value) as Show[]
})

</script>

<template>
  <div class="bg-black text-white min-h-screen">
    <ScnTabs v-model="activeTab">
      <header class="flex items-center justify-between px-6 py-4">
        <h1 class="text-3xl font-bold text-white">MovieHub</h1>
        <div class="flex space-x-4">

          <ScnInput
            v-model="query"
            type="text"
            :placeholder="`Search ${activeTab}`"
            class="pr-4 py-2 w-full text-sm bg-white/10 text-white placeholder:text-gray-400 border border-white/20 focus:ring-2 focus:ring-primary rounded-md"
          />
          <ScnTabsList class="w-[175px]">
            <ScnTabsTrigger value="movies">Movies</ScnTabsTrigger>
            <ScnTabsTrigger value="series">Series</ScnTabsTrigger>
          </ScnTabsList>
        </div>
      </header>
      <template v-if="isSearching">
        <div v-if="isSearchingPending">Loading...</div>
        <div v-if="isSearchingError">Failed to load movies.</div>
        <div v-else-if="searchResults">
          {{ searchResults }}
        </div>
      <div v-else>No results found.</div>
      </template>
      <template v-else>
        <ScnTabsContent value="movies">
          <HomeMoviesList
            @select="selectItem"
          />
        </ScnTabsContent>
        <ScnTabsContent value="series">
          <HomeSeriesList
            @select="selectItem"
          />
        </ScnTabsContent>
      </template>
    </ScnTabs>
  </div>
</template>
