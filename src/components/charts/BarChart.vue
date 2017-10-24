<script>
import Chart from './Chart'
export default{
  extends: Chart,
  props: ['dataLoad'],
  data () {
    return {
      options: {
        chart: {
          type: 'bar'
        }
      }
    }
  }
}
</script>
