<script>
import Chart from './Chart'
export default{
  extends: Chart,
  props: ['dataLoad', 'disabebleAvg', 'loading'],
  data () {
    return {
      options: {
        chart: {
          type: 'spline'
        }
      }
    }
  }
}
</script>
