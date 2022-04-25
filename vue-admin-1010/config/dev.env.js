'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://easy-moc/mock/5950a2419adc231f356a6636/vue-admin"',
  // 请求的是nginx地址，由nginx代为转发
  BASE_API:'"http://localhost:9001"'
})
