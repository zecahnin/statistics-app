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


      <el-modal ref="modalDescriptionDistribuicao" :okTitle="'OK'" :closeTitle="''">
        <div class="text-center">
          <h3>Objetos</h3>
          <div>
            <table class="table">
              <thead>
              <tr>
                <th>id</th>
                <th>Objeto</th>
                <th>Data de criação</th>
                <th>Data de atualização</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(dataRow, keyRow) of asyncDataDetalhamentoDistribuicao.data">
                  <td>
                    {{dataRow['_0']}}
                  </td>
                  <td>
                    {{dataRow['_1']}}
                  </td>
                  <td>
                    {{dataRow['_2']}}
                  </td>
                  <td>
                    {{dataRow['_3']}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--<bar-chart :dataLoad="asyncDataDetalhamentoDistribuicao"></bar-chart>-->
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
      <div class="col-md-10 col-md-offset-1 main" v-for="(dataHeader, keyHeader) of asyncMetrics.data">
        <h3>{{dataHeader['_0']}}</h3>
        <h5>{{dataHeader['_1']}}</h5>
        <div class="row" style="height: 120px;overflow-x: scroll;">
          <table class="table">
            <thead>
            <tr>
              <th data-toggle="popover"
                  v-bind:class="{'alert-success': dataRow.currentweek === 1}"
                  :title="formatWeek(dataRow.dayStart, dataRow.dayEnd)" v-for="(dataRow, keyRow) of asyncMetrics.intervalHeader">{{dataRow.week}}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td v-for="(dataCol, keyCol) of asyncMetrics.intervalHeader">
                {{asyncMetrics.onlyNumbers[keyHeader][keyCol]}}
              </td>
            </tr>
            <tr>
              <!--<td v-for="(dataCol, keyCol) of asyncMetrics.intervalHeader">
                {{calculateMetrics(asyncMetrics.onlyNumbers[keyHeader][keyCol], asyncMetrics.onlyNumbers[keyHeader][dataCol.prev]) }}
              </td>-->
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-md-10 col-md-offset-1 main">
        <div class="row" style="height: 150px;">
          <div ref="loading" v-show="asyncDataUserLoading" class="wrap-loading" style="float:left; margin-right: 2%; width: 48%; height: 100px;">
            <div class="loading loading-1"></div>
          </div>
          <div v-show="!asyncDataUserLoading" class="alert col-lg-1" role="alert"
               v-bind:class="{'alert-success': getReportUserTotalBigNumber(asyncDataUser) > 0, 'alert-danger': getReportUserTotalBigNumber(asyncDataUser) < 0}"
               style="float:left; margin-right: 2%; width: 48%">
            <h2 class="alert-heading">{{getReportUserTotalBigNumber(asyncDataUser)}}</h2>
            <h4 class="alert-heading">Usuários</h4>
          </div>
          <div ref="loading" v-show="asyncDataUserLoading" class="wrap-loading" style="float:left; margin-right: 2%; width: 48%; height: 100px;">
            <div class="loading loading-1"></div>
          </div>
          <div v-show="!asyncDataUserLoading" class="alert" role="alert"
               v-bind:class="{'alert-success': getReportUserAcessoBigNumber(asyncDataUser) > 0, 'alert-danger': getReportUserAcessoBigNumber(asyncDataUser) < 0}"
               style="float:left; margin-left: 2%; width: 48%">
            <h2 class="alert-heading">{{getReportUserAcessoBigNumber(asyncDataUser)}}</h2>
            <h4 class="alert-heading">Acessos Únicos!</h4>
          </div>
        </div>
      </div>

      <div class="col-md-10 col-md-offset-1 main">
        <h3>Captação de usuário X Atratividade de conteúdo</h3>
        <line-chart :loading="asyncDataUserLoading" :dataLoad="asyncDataUser" :disabebleAvg="'true'"></line-chart>
      </div>
      <br>
      <br>

      <div class="col-md-10 col-md-offset-1 main">
        <table class="table">
          <thead>
          <tr>
            <th><h1>Mídia</h1></th>
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
        <div class="row" style="height: 150px;">
          <div ref="loading" v-show="asyncDataLoading" class="wrap-loading" style="float:left; margin-right: 2%; width: 48%; height: 100px;">
            <div class="loading loading-1"></div>
          </div>
          <div v-show="!asyncDataLoading" class="alert" role="alert"
               v-bind:class="{'alert-success': getReportBigNumber(asyncData) > 0, 'alert-danger': getReportBigNumber(asyncData) < 0}"
               style="float:left; margin-right: 2%; width: 48%">
            <h2 class="alert-heading">{{getReportBigNumber(asyncData)}}</h2>
            <h4 class="alert-heading">Total de Acessos</h4>
          </div>
          <div ref="loading" v-show="asyncDataLoading" class="wrap-loading" style="float:left; margin-right: 2%; width: 48%; height: 100px;">
            <div class="loading loading-1"></div>
          </div>
          <div v-show="!asyncDataLoading" class="alert " role="alert"
               v-bind:class="{'alert-success': getReportBigNumberSaldoAcumulado(asyncData) > 0, 'alert-danger': getReportBigNumberSaldoAcumulado(asyncData) < 0}"
               style="float:left; margin-left: 2%; width: 48%">
            <h2 class="alert-heading">{{getReportBigNumberSaldoAcumulado(asyncData)}}</h2>
            <h4 class="alert-heading">Saldo Acumulado</h4>
          </div>
        </div>
      </div>
      <div class="col-md-10 col-md-offset-1 main">
        <div class="text-center">
        <div v-if="asyncData.data && asyncData.data.length <=0">Não foram encontrados resultados</div>
        </div>
        <line-chart :loading="asyncDataLoading" :dataLoad="asyncData"></line-chart>
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
        <tag-cloud :loading="asyncDataTagLoading" :dataLoad="asyncDataTag"></tag-cloud>
      </div>
      <div class="col-md-10 col-md-offset-1 main">
        <h3>Colaboradores</h3>
        <div>
          <funnel :dataLoad="asyncDataConvites" :nameSerie="'Convidados'" style="float:left; margin-right: 2%; width: 48%"></funnel>
        </div>
      </div>
      <div class="col-md-10 col-md-offset-1 main">
        <h3>Distribuição de Tarefas</h3>
        <div>
          <div class="col-lg-1 alert alert-info" role="alert"
               style="float:left; margin-right: 2%; width: 48%">
            <h2 class="alert-heading">{{getReportDistribuicaoBigNumber(asyncDataDistribuicao, 'aguardando')}}</h2>
            <h4 class="alert-heading">Tarefa Aguardando revisão</h4>
          </div>
          <div class="col-lg-1 alert alert-info" role="alert"
               style="float:left; margin-right: 2%; width: 48%">
            <h2 class="alert-heading">{{getReportDistribuicaoBigNumber(asyncDataDistribuicao, 'concluido')}}</h2>
            <h4 class="alert-heading">Tarefas Concluídas</h4>
          </div>
        </div>
        <br>
        <table class="table" :loading="asyncDataDistribuicaoLoading">
          <thead>
          <tr>
            <th>Usuário</th>
            <th>Qtd de tarefas</th>
            <th>Status das tarefas</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(dataRow, keyRow) of asyncDataDistribuicao.data">
            <td><a @click="displayDistribuicaoModal(dataRow['_0'])">{{dataRow['_0']}}</a></td>
            <td>{{dataRow['_1']}}</td>
            <td class="spark-cont">
              <spark-bar :dataLoad="dataRow" :propCol="asyncDataDistribuicao.header.col" :statistics="statistics"></spark-bar>
            </td>
          </tr>
          </tbody>
        </table>
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
import SparkBar from './charts/SparkBar'
import Funnel from './charts/Funnel'
import TagCloud from './charts/TagClound'
import ElModal from './modal/Modal'
import highchartsMixin from '@/mixins/highcharts'
import moment from 'moment'
import * as _ from 'lodash'

export default {
  name: 'conteudo',
  components: {AppMenu, LineChart, SparkLine, SparkBar, Funnel, TagCloud, Multiselect, DatePicker, ElModal, BarChart},
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

    async displayDistribuicaoModal (id) {
      let filter = {
        include: [{
          model: 'vw_tarefas'
        }],
        rows: [
          {
            field: 'objetoAprendizagemId',
            model: 'vw_tarefas'
          },
          {
            field: 'tarefa_status',
            model: 'vw_tarefas'
          },
          {
            field: 'dt_criacao',
            format: 'dd/mm/yyyy',
            model: 'vw_tarefas'
          },
          {
            field: 'dt_atualizacao',
            format: 'dd/mm/yyyy',
            model: 'vw_tarefas'
          }
        ],
        expr: [],
        where: [
          {
            field: 'nome',
            model: 'vw_tarefas',
            op: '=',
            value: id
          }
        ]
      }
      let dataOne = await this.loadReport(filter)
      this.asyncDataDetalhamentoDistribuicao = dataOne
      this.$refs.modalDescriptionDistribuicao.show()
    },
    formatWeek (dataStart, dataEnd) {
      return dataStart + ' - ' + dataEnd
    },
    async displayshowMetrics () {
      let filter = {
        include: [{
          model: 'vw_obj_meta'
        }],
        rows: [
          {
            field: 'objetvios',
            model: 'vw_obj_meta'
          },
          {
            field: 'meta',
            model: 'vw_obj_meta'
          }
        ],
        expr: [],
        where: []
      }
      let intervalHeader = {}
      for (var i = 1; i < 53; i += 1) {
        let dateIntervalStart = moment().day('Sunday').year('2018').week(i)
        let dateIntervalEnd = moment().day('Sunday').year('2018').week(i + 1)
        let dayStart = dateIntervalStart.format('DD/MM/YYYY')
        let dayEnd = dateIntervalEnd.subtract(1, 'days').format('DD/MM/YYYY')
        filter.rows.push({field: (i), model: 'vw_obj_meta'})
        intervalHeader['_' + i] = {
          dayStart: dayStart,
          dayEnd: dayEnd,
          week: (i - 1),
          prev: '_' + (i - 2),
          currentweek: (moment().week() === i) ? 1 : 0
        }
      }
      let data = await this.loadReport(filter)
      let listData = JSON.parse(JSON.stringify(data.data))
      listData.forEach(function (item, key) {
        delete item['_0']
        delete item['_1']
      })
      data.onlyNumbers = listData
      data.intervalHeader = intervalHeader
      this.asyncMetrics = data
    },
    calculateMetrics (current, prev) {
      return (current - prev) / (((prev !== 0 ? prev : 1) * 0.2) - (prev !== 0 ? prev : 1))
    },
    updateValueAction (valor) {
      if (valor !== 'tudo') {
        this.getReportDate(valor)
        this.getReportUserDate(valor)
        this.getReportTag(valor)
      } else {
        this.getReportDate()
        this.getReportUserDate()
        this.getReportTag()
      }
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
        this.asyncDataUserLoading = true
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
        this.asyncDataUserLoading = false
        this.asyncDataUser = data
      } catch (err) {
        console.log('aaaaa', err)
      }
    },
    async getReportDate (numberDays) {
      try {
        this.asyncDataLoading = true
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
        this.asyncDataLoading = false
        this.asyncData = data
      } catch (err) {
        console.log('aaaaa', err)
      }
    },
    getReportDistribuicaoBigNumber (data, type) {
      if (data.data) {
        let valueElement = 0
        let idHeader = _.result(_.find(data.header.col, function (description) {
          return description.value === type
        }), 'id')

        data.data.forEach(function (item) {
          valueElement += item[idHeader]
        })
        return valueElement
      }
    },
    async getReportDistribuicao (numberDays) {
      try {
        this.asyncDataDistribuicaoLoading = true
        let filter = {
          include: [{
            model: 'vw_tarefas'
          }],
          rows: [{
            field: 'nome',
            model: 'vw_tarefas'
          }],
          expr: [{
            field: 'id',
            model: 'vw_tarefas',
            func: 'count',
            order: 'desc'
          }],
          cols: [{
            field: 'tarefa_status',
            model: 'vw_tarefas',
            limit: 6
          }],
          where: []
        }

        let data = await this.loadReport(filter)
        this.asyncDataDistribuicaoLoading = false
        this.asyncDataDistribuicao = data
      } catch (err) {
        console.log('aaaaa', err)
      }
    },

    async getReportColaboradores (numberDays) {
      try {
        let filter = {
          include: [{
            model: 'vw_convites'
          }],
          rows: [{
            field: 'status',
            model: 'vw_convites'
          }],
          expr: [{
            field: 'id',
            model: 'vw_convites',
            func: 'count',
            order: 'desc'
          }],
          where: [
            {
              field: 'perfil',
              model: 'vw_convites',
              op: '=',
              value: 'Curador'
            }
          ]
        }

        let data = await this.loadReport(filter)
        this.asyncDataConvites = data
      } catch (err) {
        console.log('aaaa', err)
      }
    },

    async getReportTag (numberDays) {
      try {
        this.asyncDataTagLoading = true
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
        if (numberDays) {
          filterTag.where.push({
            field: 'dt_acesso',
            model: 'dados_desnomalizado',
            op: '>=',
            interval: numberDays
          })
        }
        let dataTag = await this.loadReport(filterTag)
        this.asyncDataTagLoading = false
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
    // this.getReportConclusao()
    this.displayshowMetrics()
    // this.getReportDate()
    // this.getReportTag()
    // this.loadFilter()
    // this.getReportUserDate()
    // this.getReportDistribuicao()
    // this.getReportColaboradores()
  },
  data () {
    return {
      isActive: 'b1',
      select: {
        value: null,
        options: ['list', 'of', 'options']
      },
      asyncData: [],
      asyncDataConvites: [],
      asyncDataConvitesLoading: false,
      asyncDataDistribuicao: [],
      asyncDataDistribuicaoLoading: false,
      asyncDataLoading: false,
      asyncDataUser: [],
      asyncDataUserLoading: false,
      asyncDataTagLoading: false,
      asyncDataTag: {},
      asyncDataConclusao: [],
      asyncDataDetalhamentoOne: [],
      asyncDataDetalhamentoDistribuicao: [],
      asyncDataDetalhamentoTwo: [],
      asyncMetrics: [],
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
  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @-moz-keyframes spin {
    0% {
      -moz-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -moz-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @-o-keyframes spin {
    0% {
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @-ms-keyframes spin {
    0% {
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -ms-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  html, body {
    height: 100%;
  }
  .row {
    height: 300px;
  }

  .wrap-loading {
    background: #ccc;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .loading {
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    animation: spin 750ms infinite linear;
    -webkit-animation: spin 750ms infinite linear;
    -moz-animation: spin 750ms infinite linear;
    -o-animation: spin 750ms infinite linear;
    -ms-animation: spin 750ms infinite linear;
  }
  .loading-1 {
    width: 24px;
    height: 24px;
    margin-top: -12px;
    margin-left: -12px;
    border: 2px solid #ebebeb;
    border-top-color: #ccc;
  }

</style>
