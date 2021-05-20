const sequelize = require('sequelize')
const config = require('../config/config')

const companyModel = require('./Company')
const userModel = require('./User')

const sequel = new sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
)

sequel.query('SET GLOBAL FOREIGN_KEY_CHECKS = 0')

const models = {
  Company: companyModel(sequel, sequelize.DataTypes),
  User: userModel(sequel, sequelize.DataTypes)
}

Object.keys(models).forEach(function (modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

models.sequel = sequel
models.sequelize = sequelize

module.exports = models