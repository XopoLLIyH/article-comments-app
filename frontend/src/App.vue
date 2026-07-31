<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Article Manager</v-app-bar-title>
      <v-btn :to="{ name: 'articles' }">Articles</v-btn>
      <v-btn :to="{ name: 'analytics' }">Comment analytics</v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-8" style="max-width: 1100px">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

