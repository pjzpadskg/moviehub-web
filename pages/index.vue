<script setup lang="ts">
import { refDebounced } from '@vueuse/core'

const activeTab = useState<'movies' | 'series'>('activeTab', () => 'movies')
const searchQuery = useState<string>('searchQuery', () => '')
const debouncedQuery = refDebounced(searchQuery, 1000)
const selectedIndex = useState<number>('selectedIndex', () => 0)
const selectItem = (index: number) => {
  selectedIndex.value = index
}

const resetQuery = () => { searchQuery.value = '' }

const isSearching = computed(() => debouncedQuery.value?.trim().length > 0)
watch(activeTab, () => selectedIndex.value = 0)
</script>

<template>
  <div class="bg-black text-white min-h-screen">
    <ScnTabs v-model="activeTab">
      <header class="flex items-center justify-between px-6 py-4">
        <h1 
          class="text-3xl font-bold text-white hover:cursor-pointer hover:scale-[107%]"
          @click="resetQuery"
        >
          MovieHub
        </h1>
        <div class="flex space-x-4">
          <ScnInput
            v-model="searchQuery"
            type="search"
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
        <div>
          <LazyAppSearchWindow 
            v-if="isSearching"
            v-model="debouncedQuery"
          />
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
