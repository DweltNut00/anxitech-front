<template>
  <div class="app">
      <router-view />
  </div>
</template>

<script setup>
import { useAppStore } from './stores/app';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.app {
  height: 100vh;
  max-height: 100vh;
}
</style>