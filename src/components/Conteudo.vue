<template>
  <div class="container-fluid">
    <div class="row" style="background-color: #f7f7f7;">
      <!--<app-menu></app-menu>-->

      <el-modal ref="modalDescription" :okTitle="'OK'" :closeTitle="''">
        <div class="text-center">
          <h3>Objeto por percentual de conclusão</h3>
          <bar-chart :dataLoad="asyncDataDetalhamentoOne"></bar-chart>
          <br>
          <h3>Acesso por horário</h3>
          <bar-chart :dataLoad="asyncDataDetalhamentoTwo"></bar-chart>
        </div>
      </el-modal>

      <div>
        <div class="col-md-10 col-md-offset-1 main">
          <div class="text-center">
            <div class="btn-group" role="group" aria-label="...">
              <button :class="{ active: isActive == 'b1' }" type="button" class="btn btn-default" @click="updateValueAction('tudo'), isActive = 'b1'">Tudo</button>
              <button :class="{ active: isActive == 'b2' }" type="button" class="btn btn-default" @click="updateValueAction(7), isActive = 'b2'">Ultimos 7 dias</button>
              <button :class="{ active: isActive == 'b3' }" type="button" class="btn btn-default" @click="updateValueAction(15), isActive = 'b3'">Últimos 15 dias</button>
              <button :class="{ active: isActive == 'b4' }" type="button" class="btn btn-default" @click="updateValueAction(30), isActive = 'b4'">Últimos 30 dias</button>
              <button :class="{ active: isActive == 'b5' }" type="button" class="btn btn-default" @click="updateValueAction(60), isActive = 'b5'">Ùltimos 60 dias</button>
              <button :class="{ active: isActive == 'b6' }" type="button" class="btn btn-default" @click="updateValueAction(90), isActive = 'b6'">Ùltimos 90 dias</button>
              <button :class="{ active: isActive == 'b7' }" type="button" class="btn btn-default" @click="updateValueAction(180), isActive = 'b7'">Ùltimos 180 dias</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-10 col-md-offset-1 main">
        <div class="alert" role="alert"
             v-bind:class="{'alert-success': getReportUserTotalBigNumber(asyncDataUser) > 0, 'alert-danger': getReportUserTotalBigNumber(asyncDataUser) < 0}"
             style="float:left; margin-right: 2%; width: 48%">
          <h2 class="alert-heading">{{getReportUserTotalBigNumber(asyncDataUser)}}</h2>
          <h4 class="alert-heading">Usuários</h4>
        </div>
        <div class="alert" role="alert"
             v-bind:class="{'alert-success': getReportUserAcessoBigNumber(asyncDataUser) > 0, 'alert-danger': getReportUserAcessoBigNumber(asyncDataUser) < 0}"
             style="float:left; margin-left: 2%; width: 48%">
          <h2 class="alert-heading">{{getReportUserAcessoBigNumber(asyncDataUser)}}</h2>
          <h4 class="alert-heading">Acessos Únicos!</h4>
        </div>
      </div>

      <div class="col-md-10 col-md-offset-1 main">
        <h3>Captação de usuário X Atratividade de conteúdo</h3>
        <line-chart :dataLoad="asyncDataUser" :disabebleAvg="'true'"></line-chart>
      </div>

      <div class="col-md-10 col-md-offset-1 main">
        <table class="table">
          <thead>
          <tr>
            <th>Mídia</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <multiselect class="size-input30" v-model="filter.midia.value" :options="filter.midia.options" @input="updateValueAction(null)"></multiselect>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="col-md-10 col-md-offset-1 main">

        <div class="alert" role="alert"
             v-bind:class="{'alert-success': getReportBigNumber(asyncData) > 0, 'alert-danger': getReportBigNumber(asyncData) < 0}"
             style="float:left; margin-right: 2%; width: 48%">
          <h2 class="alert-heading">{{getReportBigNumber(asyncData)}}</h2>
          <h4 class="alert-heading">Total de Acessos</h4>
        </div>
        <div class="alert " role="alert"
             v-bind:class="{'alert-success': getReportBigNumberSaldoAcumulado(asyncData) > 0, 'alert-danger': getReportBigNumberSaldoAcumulado(asyncData) < 0}"
             style="float:left; margin-left: 2%; width: 48%">
          <h2 class="alert-heading">{{getReportBigNumberSaldoAcumulado(asyncData)}}</h2>
          <h4 class="alert-heading">Saldo Acumulado</h4>
        </div>
      </div>
      <div class="col-md-10 col-md-offset-1 main">
        <div class="text-center">
        <div v-if="asyncData.data && asyncData.data.length <=0">Não foram encontrados resultados</div>
        </div>
        <line-chart :dataLoad="asyncData"></line-chart>
      </div>
      <div class="col-md-10 col-md-offset-1 main">
        <h3>Detalhamentos dos acessos</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Objeto</th>
              <th>Qtd de acessos</th>
              <th>Evolução</th>
              <th>Saldo acumulado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dataRow, keyRow) of asyncData.data">
              <td><a @click="displayModal(dataRow['_0'])">{{dataRow['_0']}}</a></td>
              <td>{{dataRow['_1']}}</td>
              <td class="spark-cont">
                  <spark-line :dataLoad="dataRow" :propCol="asyncData.header.col" :statistics="statistics"></spark-line>
              </td>
              <td>
                <div style="float:left">
                {{somaAcumulada(dataRow, asyncData.header.col)}}
                <div v-if="somaAcumulada(dataRow, asyncData.header.col) > 0" style="float:left">
                    <i class="fa fa-arrow-up" style="color: blue"></i>
                </div>
                <div v-else style="float:left">
                  <i class="fa fa-arrow-down"style="color: red"></i>
                </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-10 col-md-offset-1 main">
        <h3>Acessos por Tag dos objetos</h3>
        <tag-cloud :dataLoad="asyncDataTag"></tag-cloud>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Multiselect from 'vue-multiselect'
import DatePicker from 'vue2-datepicker'
import AppMenu from '@/components/layout/AppMenu'
import BarChart from './charts/BarChart.vue'
import LineChart from './charts/LineChart'
import SparkLine from './charts/SparkLine'
import TagCloud from './charts/TagClound'
import ElModal from './modal/Modal'
import highchartsMixin from '@/mixins/highcharts'
import moment from 'moment'

export default {
  name: 'conteudo',
  components: {AppMenu, LineChart, SparkLine, TagCloud, Multiselect, DatePicker, ElModal, BarChart},
  mixins: [highchartsMixin],
  computed: {
    ...mapGetters({'query': 'loadReport'})
  },
  methods: {
    ...mapActions(['loadReport']),
    async displayModal (id) {
      let filter = {
        include: [{
          model: 'dados_desnomalizado'
        }],
        rows: [],
        expr: [{
          field: 'id',
          model: 'dados_desnomalizado',
          func: 'count',
          order: 'desc'
        }],
        where: [
          {
            field: 'titulo',
            model: 'dados_desnomalizado',
            op: '=',
            value: id
          }
        ]
      }
      let dataOne = await this.loadReport(Object.assign({}, filter, {rows: [{field: 'conclusao', model: 'dados_desnomalizado'}]}))
      this.asyncDataDetalhamentoOne = dataOne

      let dataTwo = await this.loadReport(Object.assign({}, filter, {rows: [{field: 'periodo', model: 'dados_desnomalizado'}]}))
      this.asyncDataDetalhamentoTwo = dataTwo
      this.$refs.modalDescription.show()
    },
    updateValueAction (valor) {
      this.loadFilter()
      this.getReportConclusao()
      this.getReportDate(valor)
      this.getReportTag()
    },
    async getReportConclusao () {
      try {
        let filter = {
          include: [{
            model: 'dados_desnomalizado'
          }],
          rows: [{
            field: 'titulo',
            model: 'dados_desnomalizado'
          }],
          expr: [{
            field: 'id',
            model: 'dados_desnomalizado',
            func: 'count',
            order: 'desc'
          }],
          cols: [{
            field: 'conclusao',
            model: 'dados_desnomalizado'
          }],
          where: [
            {
              field: 'tipo',
              model: 'dados_desnomalizado',
              op: '=',
              value: this.filter.tipo.value ? this.filter.tipo.value : 'Componente de Aprendizagem'
            }
          ]
        }
        if (this.filter.dataini.value) {
          filter.where.push({
            field: 'dt_acesso',
            model: 'dados_desnomalizado',
            op: '>=',
            value: moment(this.filter.dataini.value).format('YYYY-MM-DD')
          })
        }
        if (this.filter.datafim.value) {
          filter.where.push({
            field: 'dt_acesso',
            model: 'dados_desnomalizado',
            op: '<=',
            value: moment(this.filter.datafim.value).format('YYYY-MM-DD')
          })
        }
        let data = await this.loadReport(filter)
        this.asyncDataConclusao = data
      } catch (err) {
        console.log('aaaaa', err)
      }
    },
    async getReportUserDate (numberDays) {
      try {
        let filter = {
          include: [{
            model: 'vw_usuario',
            avg: true
          }],
          rows: [{
            field: 'tipo',
            model: 'vw_usuario'
          }],
          expr: [{
            field: 'usuarioId',
            model: 'vw_usuario',
            func: 'count',
            order: 'desc'
          }],
          cols: [{
            field: 'dt_acesso',
            model: 'vw_usuario',
            format: 'dd/mm/yyyy',
            limit: 6
          }],
          where: []
        }
        if (numberDays) {
          filter.where.push({
            field: 'dt_acesso',
            model: 'vw_usuario',
            op: '>=',
            interval: numberDays
          })
        }
        let data = await this.loadReport(filter)
        this.asyncDataUser = data
      } catch (err) {
        console.log('aaaaa', err)
      }
    },
    async getReportDate (numberDays) {
      try {
        let filter = {
          include: [{
            model: 'dados_desnomalizado'
          }],
          rows: [{
            field: 'titulo',
            model: 'dados_desnomalizado'
          }],
          expr: [{
            field: 'id',
            model: 'dados_desnomalizado',
            func: 'count',
            order: 'desc'
          }],
          cols: [{
            field: 'dt_acesso',
            model: 'dados_desnomalizado',
            format: 'dd/mm/yyyy',
            limit: 6
          }],
          where: [
            {
              field: 'tipo',
              model: 'dados_desnomalizado',
              op: '=',
              value: 'Componente de Aprendizagem'
            }
          ]
        }
        switch (this.filter.midia.value) {
          case 'Vídeo':
            filter.where.push({
              field: 'midia',
              model: 'dados_desnomalizado',
              op: '=',
              value: this.filter.midia.value
            })
            filter.where[0].value = 'Objeto Informacional'
            break
          case 'Lição':
            filter.where.push({
              field: 'midia',
              model: 'dados_desnomalizado',
              op: '=',
              value: this.filter.midia.value
            })
            filter.where[0].value = 'Objeto Educacional'
            break
          case 'Trilha':
            filter.where.push({
              field: 'midia',
              model: 'dados_desnomalizado',
              op: '=',
              value: this.filter.midia.value
            })
            filter.where[0].value = 'Componente de Aprendizagem'
            break
          case 'Trilha da Oportunidade':
            filter.where.push({
              field: 'midia',
              model: 'dados_desnomalizado',
              op: '=',
              value: this.filter.midia.value
            })
            filter.where[0].value = 'Componente de Aprendizagem'
            break
          default:
        }

        if (this.filter.datafim.value) {
          filter.where.push({
            field: 'dt_acesso',
            model: 'dados_desnomalizado',
            op: '<=',
            value: this.filter.datafim.value
          })
        }

        if (numberDays) {
          filter.where.push({
            field: 'dt_acesso',
            model: 'dados_desnomalizado',
            op: '>=',
            interval: numberDays
          })
        }
        let data = await this.loadReport(filter)
        this.asyncData = data
      } catch (err) {
        console.log('aaaaa', err)
      }
    },
    async getReportTag () {
      try {
        let filterTag = {
          include: [{
            model: 'vw_tags'
          }],
          rows: [{
            field: 'nome',
            model: 'vw_tags'
          }],
          expr: [{
            field: 'item',
            model: 'vw_tags',
            func: 'count'
          }],
          where: [
            {
              field: 'objetoAprendizagemTipoId',
              model: 'vw_tags',
              op: '=',
              value: '3'
            }
          ]
        }
        let dataTag = await this.loadReport(filterTag)
        this.asyncDataTag = dataTag
      } catch (err) {
        console.log('2222', err)
      }
    },
    getReportBigNumber (array) {
      if (!array.data) return 0

      let count = 0
      array.data.forEach(function (item) {
        count += item['_1']
      })
      return count
    },
    getReportUserAcessoBigNumber (array) {
      if (!array.data) return 0
      let count = 0
      array.data.forEach(function (item) {
        if (item['_0'] === 'atividade') {
          count += item['_1']
        }
      })
      return count
    },
    getReportUserTotalBigNumber (array) {
      if (!array.data) return 0

      let count = 0
      array.data.forEach(function (item) {
        if (item['_0'] === 'novo') {
          count += item['_1']
        }
      })
      return count
    },

    getReportBigNumberSaldoAcumulado (array) {
      if (!array.data) return 0

      let statistics = 0
      array.data.forEach(function (item, index) {
        statistics += array.data[(index - 1)] ? ((array.data[index]['_1'] - array.data[(index - 1)]['_1'])) : 0
      })
      return statistics
    },

    async loadFilter () {
      try {
        let filter = {
          include: [{
            model: 'dados_desnomalizado'
          }],
          rows: [{
            field: 'tipo',
            model: 'dados_desnomalizado',
            distinct: true
          }],
          where: []
        }
        if (this.filter.midia.value) {
          filter.where.push({
            field: 'midia',
            model: 'dados_desnomalizado',
            op: '=',
            value: this.filter.midia.value
          })
        }
        let dataFilterTipo = await this.loadReport(filter)
        let optionsTipo = []
        dataFilterTipo.data.forEach(function (item) {
          optionsTipo.push(item['_0'])
        })

        this.filter.tipo.options = optionsTipo
        this.periodo.options = ['Últimos 90 dias', 'Últimos 60 dias', 'Últimos 30 dias', 'Últimos 15 dias', 'Últimos 7 dias']

        let filterMidia = {
          include: [{
            model: 'dados_desnomalizado'
          }],
          rows: [{
            field: 'midia',
            model: 'dados_desnomalizado',
            distinct: true
          }],
          where: []
        }
        if (this.filter.tipo.value) {
          filterMidia.where.push({
            field: 'tipo',
            model: 'dados_desnomalizado',
            op: '=',
            value: this.filter.tipo.value
          })
        }
//        let dataFilterMidia = await this.loadReport(filterMidia)
//        let optionsMidia = []
//        dataFilterMidia.data.forEach(function (item) {
//          optionsMidia.push(item['_0'])
//        })
        this.filter.midia.options = [
          'Vídeo',
          'Lição',
          'Trilha',
          'Trilha da Oportunidade'
        ]
      } catch (err) {
        console.log('2222', err)
      }
    }
  },
  mounted: function () {
    this.getReportConclusao()
    this.getReportDate()
    this.getReportTag()
    this.loadFilter()

    // usuario
    this.getReportUserDate()
  },
  data () {
    return {
      isActive: 'b1',
      select: {
        value: null,
        options: ['list', 'of', 'options']
      },
      asyncData: [],
      asyncDataUser: [],
      asyncDataTag: {},
      asyncDataConclusao: [],
      asyncDataDetalhamentoOne: [],
      asyncDataDetalhamentoTwo: [],
      periodo: {
        value: '',
        options: []
      },
      filter: {
        tipo: {
          value: '',
          options: []
        },
        midia: {
          value: 'Trilha',
          options: []
        },
        dataini: {
          value: ''
        },
        datafim: {
          value: ''
        }
      },
      statistics: {
        statisticsUp: 0,
        statisticsDown: 0
      },
      showModal: false
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
  .spark-cont {
    height: 30px;
    width: 200px;
    display: inline-block
  }

  .size-input30 {
    width: 30%;
  }
  .btn-group{
    z-index: 0;
  }

</style>
