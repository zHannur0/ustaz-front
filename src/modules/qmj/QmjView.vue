<script setup lang="ts">
import {onMounted} from "vue";
import {useQmjStore} from "@/stores/qmjStore.ts";

const qmj = useQmjStore();

onMounted(() => {
  qmj.fetchSubjects();
});
</script>

<template>
  <h2 class="mb-4 text-xl font-bold">
    Дайын ҚМЖ
  </h2>
  <div v-if="qmj.isLoading">Жұктелуде...</div>
  <div v-else-if="qmj.error">{{ qmj.error }}</div>
  <div v-else class="px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-start">
    <router-link href v-for="s in qmj.subjects" :key="s.id" :to="`/qmj/${s.id}`"  class="flex flex-col gap-2 rounded-xl shadow">
      <img :src="s.img" :alt="s.name" class="w-full rounded-t-xl" />
      <p class="pb-2 px-2">
        {{ s.name }}
      </p>
    </router-link>
  </div>
</template>

<style scoped>

</style>