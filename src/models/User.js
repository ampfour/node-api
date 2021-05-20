const bcrypt = require('bcryptjs')
const config = require('../config/config')

async function hashPassword (user, options) {
  const SALT_FACTOR = 8

  if (!user.changed('password')) {
    return
  }
  const genSalt = await bcrypt.genSalt(SALT_FACTOR)
  const hash = await bcrypt.hash(user.password, genSalt)
  user.setDataValue('password', hash)
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    forgotPassword: DataTypes.STRING,
    firstName: {
      type: DataTypes.STRING,
      notEmpty: true
    },
    lastName: {
      type: DataTypes.STRING,
      notEmpty: true
    },
    lastLogin: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    image: DataTypes.STRING
  }, {
    getterMethods: {
      fullName () {
        return this.firstName + ' ' + this.lastName
      },
      // initials () {
      //   return this.firstName.substr(0, 1) + this.lastName.substr(0, 1)
      // },
      picture () {
        return config.host + 'images/members/' + this.image
      }
    },
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword
    }
  })

  User.associate = function (models) {
    User.belongsTo(models.Company)
  }

  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
  }

  return User
}
