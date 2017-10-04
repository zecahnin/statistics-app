<template>
  <div class="col-sm-3 col-md-2 sidebar">
    <p><img src="../../assets/img/logo.png"/></p>
    <ul class="nav nav-sidebar">
      <li :class="$route.name === route.name ? 'active' : ''" v-for="route in routes" :key="route.name">
        <router-link class="nav-link" exact-active-class="active" :to="route">
          {{route.title}}
          <span class="sr-only" :show="$route.name === route.name">(current)</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'app-menu',
  data () {
    return {
      routes: [{
        'title': 'Lista de Consultas',
        'name': 'consulta',
        'path': '/'
      }, {
        'title': 'Lista de Exames',
        'name': 'exame',
        'path': '/exame'
      }]
    }
  }
}
</script>
