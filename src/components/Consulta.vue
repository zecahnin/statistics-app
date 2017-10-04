<template>
  <div class="container-fluid">
    <div class="row">
      <app-menu></app-menu>
      <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h2 class="sub-header">Lista de Consultas</h2>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
            <tr>
              <th>Nome do paciente</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Especialidade</th>
              <th>Data do pedido</th>
              <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="consulta in consultas" :key="consulta.id">
              <td>{{consulta.usuario.name}}</td>
              <td>{{consulta.usuario.email}}</td>
              <td>({{consulta.usuario.telefone[0].ddd}}) {{consulta.usuario.telefone[0].numero}}</td>
              <td>{{consulta.especialidade.nome}}</td>
              <td>{{consulta.dataCriacao | formatDate}}</td>
              <td><input class="btn btn-sm" type="button"
                         :class="(consulta.status) ? 'btn-success' : 'btn-danger'"
                         :value="(consulta.status) ? 'Confirmado' : 'Pendente'"
                         :disabled="consulta.status"
                         @click="confirm(consulta.id)"></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppMenu from '@/components/layout/AppMenu'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'consulta',
  components: {AppMenu},
  created () {
    this.init()
  },
  computed: {
    ...mapGetters({'consultas': 'getConsultas'})
  },
  methods: {
    init () {
      this.$store.dispatch('loadConsultas')
    },
    confirm (id) {
      this.$store.dispatch('confirmConsulta', id)
    },
    ...mapActions(['loadConsultas'])
  }
}
</script>
