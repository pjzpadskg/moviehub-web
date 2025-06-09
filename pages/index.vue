<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { refDebounced } from '@vueuse/core'
import type { Show, RawShow } from '~/types/Show'
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
const debouncedQuery = refDebounced(query, 1000)
const page = ref(1)
const isSearching = computed(() => debouncedQuery.value.trim().length > 0)

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
  enabled: isSearching,
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

      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div :key="isSearching ? 'search' : 'tabs'">
          <template v-if="isSearching">
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
            <div v-else-if="searchResults?.length">
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
        </div>
      </Transition>
    </ScnTabs>
  </div>
</template>
