<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card v-if="!loading">
          <v-img
            :src="ad.imageSrc"
            height="300"
          ></v-img>
          <v-card-text>
            <h1 class="text--primary">{{ ad.title }}</h1>
            <p>{{ ad.description}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <addEditAdModal :ad="ad" v-if="isOwner"></addEditAdModal>
            <app-buy-modal :ad="ad"></app-buy-modal>
          </v-card-actions>
        </v-card>
        <div v-else class="text-center">
          <v-progress-circular
            :size="100"
            :width="5"
            color="blue"
            indeterminate
          ></v-progress-circular>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EditAdModal from './editAdModal'

export default {
  name: 'Ad',
  props: ['id'],
  computed: {
    ad () {
      const id = this.id
      return this.$store.getters.adById(id)
    },
    loading () {
      return this.$store.getters.loading
    },
    isOwner () {
      return this.ad.ownerId === this.$store.getters.user.id
    }
  },
  components: {
    addEditAdModal: EditAdModal
  }
}
</script>

<style scoped>

</style>
