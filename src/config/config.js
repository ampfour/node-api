module.exports = {
    port: process.env.PORT || 3000,
    host: 'http://localhost:3000/',
    db: {
      database: process.env.DB_NAME || 'nodetest',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'Qyb13x13x$!',
      options: {
        dialect: process.env.DB_DIALECT || 'mysql',
        host: process.env.DB_HOST || 'localhost'
      }
    },
    authentication: {
      jwtSecret: process.env.JWT_SECRET || 'secret'
    }
  }
