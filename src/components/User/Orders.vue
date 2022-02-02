<template>
  <v-container>
    <v-layout>
      <v-flex xs12 class="text-center pt-5" v-if="loading">
        <v-progress-circular
          :size="100"
          :width="5"
          color="blue"
          indeterminate
        ></v-progress-circular>
      </v-flex>
      <v-flex xs12 sm6 offset-sm-3 v-else-if="!loading && orders.length !== 0">
        <h1 class="text--secondary md-3">Orders</h1>
        <v-list
          subheader
          two-line
        >
          <v-list-item v-for="order in orders" :key="order.id">
            <v-list-item-action>
              <v-checkbox
                :input-value="order.done"
                color="success"
                @change="markDone(order)"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ order.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ order.phone }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :to="'/ad/' + order.adId"
                class="primary"
              >Open</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-flex >
      <v-flex xs12 class="text-center" v-else>
        <h1 class="text--secondary">You have no orders</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Orders',
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    orders () {
      return this.$store.getters.orders
    }
  },
  methods: {
    markDone (order) {
      this.$store.dispatch('markOrderDone', order.id)
        .then(() => {
          order.done = true
        })
        .catch(() => {})
    }
  },
  created () {
    this.$store.dispatch('fetchOrders')
  }
}
</script>

<style scoped>

</style>
