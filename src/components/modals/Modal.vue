<!-- components/modals/Modal.vue -->
<script setup lang="ts">
import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ show: boolean }>();
const emit = defineEmits(['close']);

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <transition name="fade">
    <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="$emit('close')"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <slot />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
