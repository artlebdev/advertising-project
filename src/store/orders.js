import {getDatabase, ref as refDatabase, push, onValue, child, update} from 'firebase/database'

class Order {
  constructor (name, phone, adId, done = false, id = null) {
    this.name = name
    this.phone = phone
    this.adId = adId
    this.done = done
    this.id = id
  }
}

export default {
  state: {
    orders: []
  },
  mutations: {
    loadOrders (state, payload) {
      state.orders = payload
    }
  },
  actions: {
    async createOrder ({commit}, {name, phone, adId, ownerId}) {
      const order = new Order(name, phone, adId)
      commit('clearError')
      try {
        const db = getDatabase()
        await push(refDatabase(db, `/users/${ownerId}/orders/`), {
          ...order
        })
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async fetchOrders ({commit, getters}) {
      commit('clearError')
      commit('setLoading', true)
      const resultOrders = []
      try {
        const db = getDatabase()
        const fbVal = refDatabase(db, `/users/${getters.user.id}/orders`)
        await onValue(fbVal, (snapshot) => {
          const orders = snapshot.val()
          Object.keys(orders).forEach(key => {
            const o = orders[key]
            resultOrders.push(
              new Order(o.name, o.phone, o.adId, o.done, key)
            )
          })
        }, {
          onlyOnce: true
        })
        commit('loadOrders', resultOrders)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async markOrderDone ({commit, getters}, payload) {
      commit('clearError')
      try {
        const db = getDatabase()
        await update(child(refDatabase(db, `/users/${getters.user.id}/orders`), payload), {
          done: true
        })
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    doneOrders (state) {
      return state.orders.filter(o => o.done)
    },
    undoneOrders (state) {
      return state.orders.filter(o => !o.done)
    },
    orders (state, getters) {
      return getters.undoneOrders.concat(getters.doneOrders)
    }
  }
}
