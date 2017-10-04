<template>
  <div class="container-fluid">
    <div class="row">
      <app-menu></app-menu>
      <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <h2 class="sub-header">Lista de Exames</h2>
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
            <tr v-for="exame in exames" :key="exame.id">
              <td>{{exame.usuario.name}}</td>
              <td>{{exame.usuario.email}}</td>
              <td>({{exame.usuario.telefone[0].ddd}}) {{exame.usuario.telefone[0].numero}}</td>
              <td>{{exame.exameTipo.nome}}</td>
              <td>{{exame.dataCriacao | formatDate}}</td>
              <td><input class="btn btn-sm" type="button"
                         :class="(exame.status) ? 'btn-success' : 'btn-danger'"
                         :value="(exame.status) ? 'Confirmado' : 'Pendente'"
                         :disabled="exame.status"
                         @click="confirm(exame.id)"></td>
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
  name: 'exame',
  components: {AppMenu},
  created () {
    this.init()
  },
  computed: {
    ...mapGetters({'exames': 'getExames'})
  },
  methods: {
    init () {
      this.$store.dispatch('loadExames')
    },
    confirm (id) {
      this.$store.dispatch('confirmExame', id)
    },
    ...mapActions(['loadExames'])
  }
}
</script>
