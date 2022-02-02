import { getDatabase, ref as refDatabase, push, child, update, onValue } from 'firebase/database'
import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

class Ad {
  constructor (title, description, ownerId, imageSrc = '', promo = false, id = null) {
    this.title = title
    this.description = description
    this.ownerId = ownerId
    this.imageSrc = imageSrc
    this.promo = promo
    this.id = id
  }
}

export default {
  state: {
    ads: []
  },
  mutations: {
    createAd (state, payload) {
      state.ads.push(payload)
    },
    loadAds (state, payload) {
      state.ads = payload
    },
    updateAd (state, {title, description, id}) {
      const ad = state.ads.find(a => {
        return a.id === id
      })
      ad.title = title
      ad.description = description
    }
  },
  actions: {
    async createAd ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)

      const image = payload.image

      try {
        const newAd = new Ad(
          payload.title,
          payload.description,
          getters.user.id,
          '',
          payload.promo
        )
        const db = getDatabase()
        const key = push(child(refDatabase(db), 'ads')).key
        const updates = {}
        updates['/ads/' + key] = newAd
        await update(refDatabase(db), updates)

        const imageExt = image.name.slice(image.name.lastIndexOf('.'))
        const storage = getStorage()
        const fileData = refStorage(storage, `ads/${key}.${imageExt}`)
        const metadata = {
          contentType: 'image/*'
        }
        // eslint-disable-next-line no-unused-vars
        const uploadTask = uploadBytesResumable(fileData, image, metadata)
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break
              case 'storage/canceled':
                // User canceled the upload
                break

              // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL)
              commit('createAd', {
                ...newAd,
                id: key,
                imageSrc: downloadURL
              })
              update(refDatabase(db, 'ads/' + key), {
                imageSrc: downloadURL
              })
            })
          }
        )
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchAds ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      const resultAds = []
      try {
        const db = getDatabase()
        const fbValue = refDatabase(db, 'ads')
        await onValue(fbValue, (snapshot) => {
          const ads = snapshot.val()
          if (ads !== null) {
            Object.keys(ads).forEach(key => {
              const ad = ads[key]
              resultAds.push(
                new Ad(ad.title, ad.description, ad.ownerId, ad.imageSrc, ad.promo, key)
              )
            })
          }
        }, {
          onlyOnce: true
        })
        commit('loadAds', resultAds)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async updateAd ({commit}, {title, description, id}) {
      commit('clearError')
      commit('setLoading', true)

      try {
        const db = getDatabase()
        await update(refDatabase(db, 'ads/' + id), {
          title, description
        })
        commit('updateAd', {
          title, description, id
        })
        commit('setLoading', false)
      } catch (error) {
        commit('clearError', error.message)
        commit('setLoading', false)
        throw error
      }
    }
  },
  getters: {
    ads (state) {
      return state.ads
    },
    promoAds (state) {
      return state.ads.filter(ad => {
        return ad.promo
      })
    },
    myAds (state, getters) {
      return state.ads.filter(ad => {
        return ad.ownerId === getters.user.id
      })
    },
    adById (state) {
      return adId => {
        return state.ads.find(ad => ad.id === adId)
      }
    }
  }
}
