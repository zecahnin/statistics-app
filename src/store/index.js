import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {helper} from '@/core/utils'

Vue.use(Vuex)

const state = {
  consultas: [],
  exames: []
}
const mutations = {
  fetchConsultas (state, data) {
    state.consultas = data
  },
  fetchExames (state, data) {
    state.exames = data
  },
  updateConsultas (state, data) {
    state.consultas = helper.mergeById(state.consultas, data)
  },
  updateExames (state, data) {
    state.exames = helper.mergeById(state.exames, data)
  }
}
const getters = {
  getConsultas: state => state.consultas,
  getExames: state => state.exames
}
const actions = {
  async loadConsultas ({commit}) {
    try {
      let filter = {
        'include': ['usuario', 'especialidade'],
        'order': 'dataCriacao DESC'
      }
      let {data} = await axios.get('http://localhost:3000/api/consultas?filter=' + JSON.stringify(filter))
      commit('fetchConsultas', data)
    } catch (err) {

    }
  },
  async confirmConsulta ({commit}, id) {
    try {
      let {data} = await axios.patch('http://localhost:3000/api/consultas/' + id, {
        'id': id,
        'status': true
      })
      commit('updateConsultas', [data])
    } catch (err) {

    }
  },
  async loadExames ({commit}) {
    try {
      let filter = {
        'include': ['usuario', 'exameTipo'],
        'order': 'dataCriacao DESC'
      }
      let {data} = await axios.get('http://localhost:3000/api/exames?filter=' + JSON.stringify(filter))
      commit('fetchExames', data)
    } catch (err) {

    }
  },
  async confirmExame ({commit}, id) {
    try {
      let {data} = await axios.patch('http://localhost:3000/api/exames/' + id, {
        'id': id,
        'status': true
      })
      commit('updateExames', [data])
    } catch (err) {

    }
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
