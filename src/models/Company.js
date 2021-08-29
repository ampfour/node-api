module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
      name: DataTypes.STRING,
      contact: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING(20),
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING(2),
      zip: DataTypes.STRING(10),
      description: DataTypes.TEXT,
      active: {
        type: DataTypes.BOOLEAN,
        notEmpty: true
      },
    })

    Company.associate = function (models) {
      Company.hasMany(models.User)
    }

    return Company
  }
