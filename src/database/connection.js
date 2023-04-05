const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : process.env.HOST_MYSQL,
      user : process.env.USER_MYSQL,
      password : process.env.PASSWORD_MYSQL,
      database : process.env.DATABASE_MYSQL
    }
  })

module.exports = knex