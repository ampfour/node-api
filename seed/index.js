const {
  sequel,
  User,
  Company
} = require('../src/models')

const Promise = require('bluebird')
const users = require('./users.json')
const company = require('./company.json')

sequel.sync({force: true})
  .then(async function () {
    await Promise.all(
      users.map(user => {
        User.create(user)
      })
    )
  }).then(async function () {
    await Promise.all(
      company.map(company => {
        Company.create(company)
      })
    )
  })
