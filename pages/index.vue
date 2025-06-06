<script setup lang="ts">
const activeTab = useState<'movies' | 'series'>('activeTab', () => 'movies')
const selectedIndex = useState<number>('selectedIndex', () => 0)
const selectItem = (index: number) => {
  selectedIndex.value = index
}
watch(activeTab, () => selectedIndex.value = 0)
</script>

<template>
  <div class="bg-black text-white min-h-screen">
    <ScnTabs v-model="activeTab">
      <header class="flex items-center justify-between px-6 py-4">
        <h1 class="text-3xl font-bold text-white">MovieHub</h1>
        <div class="flex space-x-4">

          <ScnInput
            type="text"
            :placeholder="`Search ${activeTab}`"
            class="pr-4 py-2 w-full text-sm bg-white/10 text-white placeholder:text-gray-400 border border-white/20 focus:ring-2 focus:ring-primary rounded-md"
          />
          <ScnTabsList class="w-[175px]">
             <!-- if too small, make icon -->
            <ScnTabsTrigger value="movies">Movies</ScnTabsTrigger>
            <ScnTabsTrigger value="series">Series</ScnTabsTrigger>
          </ScnTabsList>
        </div>
      </header>
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
    </ScnTabs>
  </div>
</template>
