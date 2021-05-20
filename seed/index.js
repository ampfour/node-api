const {
  sequel,
  User
} = require('../src/models')

const Promise = require('bluebird')
const users = require('./users.json')

sequel.sync({force: true})
  .then(async function () {
    await Promise.all(
      users.map(user => {
        User.create(user)
      })
    )
  })
