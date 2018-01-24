<template>
  <div class="row" style="height: 400px;">
    <div ref="loading" v-show="loading" class="wrap-loading">
      <div class="loading loading-1"></div>
    </div>
    <div ref="chart" :options="options" :dataLoad="transformToChart(dataLoad)" :disabebleAvg="disabebleAvg"></div>
  </div>
</template>

<script>
import Highcharts from 'highcharts-more-node'
import highchartsMixin from '@/mixins/highcharts'
// import {chunk} from 'lodash'
export default{
  name: 'chart',
  mixins: [highchartsMixin],
  components: {
    Highcharts
  },
  props: ['dataLoad', 'disabebleAvg', 'loading'],
  data () {
    return {
      options: {
        chart: {
          zoomType: 'x'
        },
        legend: {
          enabled: false
        },
        title: {
          text: ''
        },
        subtitle: {
          text: ''
        },
        xAxis: {
        },
        yAxis: {
          title: {
            text: 'Quantidade'
          }
        },
        tooltip: {
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            animation: false,
            marker: {
              enabled: false
            }
          }
        },
        series: []
      },
      target: null
    }
  },
  updated: function () {
    this.load()
  },
  methods: {
    load () {
      if (this.dataLoad.series) {
        var dataParse = JSON.parse(JSON.stringify(this.dataLoad.series))
        var dataCategories = JSON.parse(JSON.stringify(this.dataLoad.categories))
        var options = Object.assign({}, JSON.parse(JSON.stringify(this._data.options)),
          {series: dataParse},
          {xAxis: {categories: dataCategories, labels: {rotation: -90}}})
        this.target = Highcharts.chart(this.$refs.chart, options)
        if (this.disabebleAvg === undefined) {
          this.target.addSeries(this.dataLoad.avgSerie)
        }
      }
    },
    transformToChart: function (data) {
      return this.transformData(data)
    }
  },
  beforeDestroy: function () {
    // this.target.destroy()
  }
}
</script>
<style>
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
