var knex = require('knex')({
  client: 'mysql',
  connection: {
    database: 'production_api',
    user: 'root',
    password: 'zeca',
    host: 'localhost'
  },
  migrations: {
    tableName: 'knex_migrations'
  }
})

module.exports = knex
