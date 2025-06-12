<script setup lang="ts">

import router from "@/router";

const navs = [
  {
    id: "nav-1",
    title: "Курстар",
    link: "/courses"
  },
  {
    id: "nav-2",
    title: "Дайын ҚМЖ",
    link: "/qmg"
  },
  {
    id: "nav-3",
    title: "Кітаптар",
    link: "/books"
  },
]

</script>

<template>
  <header class="w-full flex items-center justify-center py-2 ">
    <div class="w-full max-w-[1440px] flex justify-between items-center px-4 py-2">
        <h1 class="text-2xl font-bold tracking-tight cursor-pointer" @click="router.push({ name: 'home' })">Ustaz</h1>
    <div class="flex items-center gap-3">
      <router-link v-for="nav in navs" :key="nav.id" :to="nav.link">
        {{ nav.title }}
      </router-link>
      <button >
        Кіру/Тіркелу
      </button>
    </div>
    </div>
  </header>
</template>

<style scoped>

</style>