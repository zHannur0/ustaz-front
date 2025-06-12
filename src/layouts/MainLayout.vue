<script setup lang="ts">

import Wrapper from "@/components/layout/Wrapper.vue";
import Header from "@/components/layout/Header.vue";
import SideBar from "@/components/layout/SideBar.vue";
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-screen h-full">
    <Wrapper>
      <Header/>
      <main class="flex w-full h-full">
        <SideBar/>
        <slot/>
      </main>
    </Wrapper>
  </div>

</template>

<style scoped>

</style>