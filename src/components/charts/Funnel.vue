<template>
  <div :dataLoad="dataLoad" :nameSerie="nameSerie" ref="chart"></div>
</template>
<script>
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
highchartsMore(Highcharts)
require('highcharts/modules/funnel')(Highcharts)

import highchartsMixin from '@/mixins/highcharts'

export default{
  name: 'Funnel',
  mixins: [highchartsMixin],
  components: {
    Highcharts
  },
  props: ['dataLoad', 'nameSerie'],
  updated: function () {
    this.load()
  },
  data () {
    return {
      dataFunnel: this.dataLoad,
      options: {
        chart: {
          type: 'funnel'
        },
        title: {
          text: 'Sales funnel'
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b> ({point.y:,.0f})',
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
              softConnector: true
            },
            center: ['40%', '50%'],
            neckWidth: '30%',
            neckHeight: '25%',
            width: '80%'
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: 'Unique users',
          data: []
        }]
      }
    }
  },
  mounted () {
  },
  methods: {
    load () {
      var self = this
      self.options.title.text = self.nameSerie
      var options = {}
      options.series = []
      options.series[0] = {}
      options.series[0].data = []
      options.series[0].name = self.nameSerie
      if (this.dataLoad.data) {
        this.dataLoad.data.forEach(function (itemHeaderCol, index) {
          options.series[0].data.push({name: itemHeaderCol['_0'], y: itemHeaderCol['_1']})
        })
        this.target = Highcharts.chart(this.$el, Object.assign({}, self.options, options))
      }
    }
  }
}
</script>
