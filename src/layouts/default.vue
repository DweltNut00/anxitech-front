<template>
  <div class="default">
    <v-card class="left" color="light-blue-darken-2" rounded="lg">
      <div class="logo">
        <img src="../assets/logo.png" alt="anxitech" />
      </div>

      <div class="text">
        <h1 class="title">{{ appStore.getDefaultTitle }}</h1>
        <p class="subtitle">{{ appStore.getDefaultSubtitle }}</p>
      </div>

      <div class="bottom">
        <p class="phrase">Lo peor que puede hacer la ansiedad es asustarte.</p>
        <p class="author">- Claire Weekes</p>
      </div>
    </v-card>
    <div class="right">
      <v-progress-circular color="primary" indeterminate v-if="appStore.isLoading"></v-progress-circular>
      <router-view v-else />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app.js';
import { useTheme } from 'vuetify'

const theme = useTheme()

const appStore = useAppStore()

theme.global.name.value = 'light';

</script>

<style lang="scss" scoped>
@use '../styles/settings.scss' as constants;

.default {
  display: grid;
  grid-template-columns: 1fr 2fr;
  height: 100%;

  .left,
  .right {
    padding: constants.$padding;
  }

  .left {
    margin: constants.$margin;
    padding: constants.$padding * 2;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .logo {
      max-height: 4%;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 0%;
      }
    }

    .text {
      .title {
        font-size: 3rem;
        line-height: 1;
      }

      .subtitle {
        margin-top: 1rem;
        line-height: 1.5;
        letter-spacing: 0.1rem;
        font-weight: 200;
      }
    }

    .bottom {
      .author {
        text-align: right;
        font-style: italic;
      }
    }
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: constants.$margin;

    width: min(75%, 50rem);

    margin: 0 auto;
  }
}
</style>
