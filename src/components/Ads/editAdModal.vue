<template>
  <v-dialog width="400" v-model="modal">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="warning"
        dark
        v-bind="attrs"
        v-on="on"
      >
        Open
      </v-btn>
    </template>

    <v-card>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-card-title>
              <h1 class="text-primary">Edit ad</h1>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-card-text>
              <v-text-field
                name="title"
                label="title"
                type="text"
                v-model="editedTitle"
              ></v-text-field>
              <v-textarea
                name="description"
                label="description"
                type="text"
                v-model="editedDescription"
              ></v-textarea>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="onCancel">Cancel</v-btn>
              <v-btn class="success" @click="onSave" text>Save</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['ad'],
  name: 'editAdModal',
  data () {
    return {
      modal: false,
      editedTitle: this.ad.title,
      editedDescription: this.ad.description
    }
  },
  methods: {
    onCancel  () {
      this.editedDescription = this.ad.description
      this.editedTitle = this.ad.title
      this.modal = false
    },
    onSave () {
      if (this.editedDescription !== '' && this.editedTitle !== '') {
        this.$store.dispatch('updateAd', {
          title: this.editedTitle,
          description: this.editedDescription,
          id: this.ad.id
        })

        this.modal = false
      }
    }
  }
}
</script>

<style scoped>

</style>
