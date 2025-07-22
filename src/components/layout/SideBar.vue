<script setup lang="ts">
  const sideBarNavs = [
    {
      id: "sideBarNavs-1",
      title: "Менің курстарым",
      link: "/my-courses"
    },
    {
      id: "sideBarNavs-2",
      title: "Менің ҚМЖ-ларым",
      link: "/my-qmg"
    },
    {
      id: "sideBarNavs-3",
      title: "Менің кітаптарым",
      link: "/my-books"
    },
  ]
</script>

<template>
  <div class="w-full max-w-[300px] bg-primary h-full flex flex-col items-center gap-3 p-4 rounded-2xl min-h-[70vh] shadow-md font-medium">
    <router-link v-for="nav in sideBarNavs" :key="nav.id" :to="nav.link" class="flex items-center w-full bg-white py-2 px-3 rounded-xl hover:text-default">
      {{ nav.title }}
    </router-link>
  </div>
</template>

<style scoped>

</style>