<template>
  <div class="row" style="height: 400px;">
    <div ref="loading" v-show="loading" class="wrap-loading">
      <div class="loading loading-1"></div>
    </div>
    <div ref="chart" :dataLoad="dataLoad"></div>
  </div>
</template>
<script>
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
highchartsMore(Highcharts)
require('highcharts/modules/wordcloud')(Highcharts)

import highchartsMixin from '@/mixins/highcharts'
export default{
  name: 'TagCloud',
  props: ['dataLoad', 'loading'],
  mixins: [highchartsMixin],
  components: {
    Highcharts
  },
  updated: function () {
    this.load()
    /* self.dataTag.data.forEach(function (item, index) {
      console.log(item)
    }) */
  },
  data () {
    return {
      dataTag: this.dataLoad,
      options: {
        chart: {
          type: 'wordcloud'
        },
        plotOptions: {
          series: {
            animation: false
          }
        },
        credits: {
          enabled: false
        },
        series: [{
          type: 'wordcloud',
          data: []
        }],
        title: {
          text: ''
        }
      }
    }
  },
  methods: {
    load () {
      if (this.dataLoad.data) {
        var series = this.transformSimpleSerie(this.dataLoad)
        this._data.options.series[0].data = series
        var options = Object.assign({}, JSON.parse(JSON.stringify(this._data.options)))
        this.target = Highcharts.chart(this.$refs.chart, options)
      }
    }
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
