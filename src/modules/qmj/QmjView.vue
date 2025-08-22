<script setup lang="ts">
import {onMounted} from "vue";
import {useQmjStore} from "@/stores/qmjStore.ts";

const qmj = useQmjStore();

onMounted(() => {
  qmj.fetchSubjects();
});
</script>

<template>
  <div v-if="qmj.isLoading">Загрузка...</div>
  <div v-else-if="qmj.error">{{ qmj.error }}</div>
  <ul v-else>
    <li v-for="s in qmj.subjects" :key="s.id">{{ s.name }}</li>
  </ul>
  asdfasdf
</template>

<style scoped>

</style>