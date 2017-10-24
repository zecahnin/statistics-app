<template>
  <div class="container-fluid">
    <div class="row">
      <app-menu></app-menu>

      <el-modal ref="modalDescription" :okTitle="'OK'" :closeTitle="''">
        <div class="text-center">
          <p class="title">Valeu!<i class="material-icons">thumb_up</i></p>
          <bar-chart :dataLoad="asyncDataDetalhamentoOne"></bar-chart>
        </div>
      </el-modal>

      <div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          <table class="table">
            <thead>
              <tr>
                <th>Tipo de Elemento</th>
                <th>Mídia</th>
                <th>Data Inicial</th>
                <th>Data Final</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <multiselect v-model="filter.tipo.value" :options="filter.tipo.options" @input="updateValueAction"></multiselect>
                </td>
                <td>
                  <multiselect v-model="filter.midia.value" :options="filter.midia.options"></multiselect>
                </td>
                <td>
                  <date-picker v-model="filter.dataini.value" lang="pt-br" placeholder="Data Incial" @input="updateValueAction"></date-picker>
                </td>
                <td>
                  <date-picker v-model="filter.datafim.value" lang="pt-br" placeholder="Data Fim" @input="updateValueAction"></date-picker>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <line-chart :dataLoad="asyncData"></line-chart>
      </div>
      <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <table class="table">
          <thead>
            <tr>
              <th>Objeto</th>
              <th>Acessos</th>
              <th>Evolução</th>
              <th>Novos Acessos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dataRow, keyRow) of asyncData.data">
              <td><a @click="displayModal(dataRow['_0'])">{{dataRow['_0']}}</a></td>
              <td>{{dataRow['_1']}}</td>
              <td class="spark-cont">
                  <spark-line :dataLoad="dataRow" :propCol="asyncData.header.col" :statistics="statistics"></spark-line>
              </td>
              <td>{{somaAcumulada(dataRow, asyncData.header.col)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
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
      let data = await this.loadReport(Object.assign({}, filter, {rows: [{field: 'conclusao', model: 'dados_desnomalizado'}]}))
      this.asyncDataDetalhamentoOne = data
      this.$refs.modalDescription.show()
    },
    updateValueAction () {
      this.getReportConclusao()
      this.getReportDate()
      this.loadFilter()
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
            field: 'data',
            model: 'dados_desnomalizado',
            op: '>=',
            value: this.filter.dataini.value
          })
        }
        if (this.filter.datafim.value) {
          filter.where.push({
            field: 'data',
            model: 'dados_desnomalizado',
            op: '<=',
            value: this.filter.datafim.value
          })
        }
        let data = await this.loadReport(filter)
        this.asyncDataConclusao = data
      } catch (err) {
        console.log('aaaaa', err)
      }
    },
    async getReportDate () {
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
            field: 'data',
            model: 'dados_desnomalizado',
            format: 'dd/mm/yyyy',
            limit: 6
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
            field: 'data',
            model: 'dados_desnomalizado',
            op: '>=',
            value: this.filter.dataini.value
          })
        }
        if (this.filter.datafim.value) {
          filter.where.push({
            field: 'data',
            model: 'dados_desnomalizado',
            op: '<=',
            value: this.filter.datafim.value
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
        let dataFilterMidia = await this.loadReport(filterMidia)
        let optionsMidia = []
        dataFilterMidia.data.forEach(function (item) {
          optionsMidia.push(item['_0'])
        })
        this.filter.midia.options = optionsMidia
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
  },
  data () {
    return {
      select: {
        value: null,
        options: ['list', 'of', 'options']
      },
      asyncData: [],
      asyncDataTag: {},
      asyncDataConclusao: [],
      asyncDataDetalhamentoOne: [],
      filter: {
        tipo: {
          value: '',
          options: []
        },
        midia: {
          value: '',
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
</style>
