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
          text: ''
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b> ({point.y:,.0f})',
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
              softConnector: true
            }
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
      var options = {}
      options.series = []
      options.series[0] = {}
      options.series[0].data = []
      options.series[0].name = self.nameSerie
      if (this.dataLoad.data) {
        var sortArray = ['Em análise', 'Aprovados', 'Ativados']
        this.dataLoad.data.sort(
          function (a, b) {                              // Pass a function to the sort that takes 2 elements to compare
            console.log(a, b)
            if (a['_0'] === b['_0']) {                    // If the elements both have the same `type`,
              return a['_0'].localeCompare(b['_0']) // Compare the elements by `name`.
            } else {                                   // Otherwise,
              return sortArray.indexOf(a['_0']) - sortArray.indexOf(b['_0']) // Substract indexes, If element `a` comes first in the array, the returned value will be negative, resulting in it being sorted before `b`, and vice versa.
            }
          }
        )
        console.log(this.dataLoad.data)
        this.dataLoad.data.forEach(function (itemHeaderCol, index) {
          options.series[0].data.push({name: itemHeaderCol['_0'], y: itemHeaderCol['_1']})
        })
        this.target = Highcharts.chart(this.$el, Object.assign({}, self.options, options))
      }
    }
  }
}
</script>
