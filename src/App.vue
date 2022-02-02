<template>
  <v-app>
    <v-navigation-drawer
      app
      temporary
      v-model="drawer"
    >
      <v-list>
        <v-list-item
          v-for="link of links"
          :key="link.title"
          :to="link.url"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="link.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="isUserLoggedIn"
          @click="onLogout"
        >
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="'Logout'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" custom class="pointer" v-slot="{ navigate }">
          <span @click="navigate" @keypress.enter="navigate" role="link">Ad application</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.url"
          text
        >
          <v-icon left>
            {{ link.icon }}
          </v-icon>
          {{ link.title }}
        </v-btn>
        <v-btn
          text
          @click="onLogout"
          v-if="isUserLoggedIn"
        >
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
        <router-view></router-view>
    </v-main>
    <template v-if="error">
      <v-snackbar
        :timeout="5000"
        color="error"
        @input="closeError"
        :value="true"
      >
        {{ error }}
        <v-btn dark text @click.native="closeError"
        >
          Close
        </v-btn>
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    closeError () {
      this.$store.dispatch('clearError')
    },
    onLogout () {
      this.$store.dispatch('logoutUser')
      if (this.$router.currentRoute.name !== 'home') {
        this.$router.push('/')
      }
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
    },
    links () {
      if (this.isUserLoggedIn) {
        return [
          { title: 'Orders', icon: 'mdi-bookmark', url: '/orders' },
          { title: 'New ad', icon: 'mdi-note-plus', url: '/new' },
          { title: 'My ads', icon: 'mdi-book', url: '/list' }
        ]
      }
      return [
        { title: 'Login', icon: 'mdi-lock', url: '/login' },
        { title: 'Registration', icon: 'mdi-account-circle', url: '/registration' }
      ]
    }
  }
}
</script>

<style>
  .pointer {
    cursor: pointer;
  }
</style>
