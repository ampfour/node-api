const multer = require('multer')

const AuthenticationController = require('./controllers/AuthenticationController')
const UserController = require('./controllers/UserController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const isAuthenticated = require('./policies/isAuthenticated')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/attachments/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

module.exports = (app) => {
  // AuthenticationController Routes
  app.post('/register', isAuthenticated, AuthenticationControllerPolicy.register, AuthenticationController.register)
  app.post('/login', AuthenticationController.login)
  app.post('/forgot_password', AuthenticationController.forgotPassword)
  app.post('/reset_password', AuthenticationController.resetPassword)

  app.get('/users', isAuthenticated, UserController.getUsers)
  app.get('/user/:userId', UserController.getUser)
  app.post('/users', isAuthenticated, UserController.addUser)
  app.put('/users/:userId', isAuthenticated, UserController.updateUser)
  app.delete('/users/:userId', isAuthenticated, UserController.deleteUser)
}
