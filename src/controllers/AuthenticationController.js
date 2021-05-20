const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const moment = require('moment')

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register (req, res) {
    try {
      const user = await User.create(req.body)
      res.send(user.toJSON())
    } catch (err) {
      res.status(400).send({
        error: 'This email account is already in use.'
      })
    }
  },

  async login (req, res) {
    try {
      const {email, password} = req.body
      const user = await User.findOne({
        where: {
          email: email,
          status: 'active'
        }
      })

      if (!user) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }

      const isPasswordValid = await user.comparePassword(password)

      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }

      let currentDate = moment().format('YYYY-MM-DD HH:MM:ss')
      let currentYear = moment().format('YYYY')

      await User.update(
        { lastLogin: currentDate },
        { where: { id: user.id } }
      )

      const userJson = user.toJSON()

      delete userJson.password
      delete userJson.notes
      delete userJson.forgotPassword

      userJson.manpower = currentYear

      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(500).send({
        error: 'An Error has occured trying to login.'
      })
    }
  },

  async forgotPassword (req, res) {
    try {
      const { email } = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if (user) {
        var forgotToken = jwt.sign({ id: user.id, email: email }, config.authentication.jwtSecret, {
          expiresIn: '3600'
        })

        // var decoded = jwt.verify(forgotToken, config.authentication.jwtSecret)
        // console.log(decoded.id)
        // console.log(decoded.email)

        // var decodedit = jwt.decode(forgotToken, {complete: true})
        // console.log(decodedit.header)
        // console.log(decodedit.payload)

        const msg = {
          to: email,
          from: 'troy@ampfour.com',
          subject: 'Password Reset',
          text: `
          To reset password follow this link

          ${process.env.FRONT}/reset_password?rid=${forgotToken}
          `,
          html: `
          To reset password follow this link<br /><br />

          <a href="${process.env.FRONT}/reset_password?rid=${forgotToken}">Reset Password</a>
          `
        }

        await sgMail.send(msg)

        await User.update(
          { forgotPassword: forgotToken },
          { where: { id: user.id } }
        )
      }

      res.status(200).send({
        message: 'Email Send'
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to send email'
      })
    }
  },

  async resetPassword (req, res) {
    try {
      const { rid } = req.body

      const user = await User.findOne({
        where: {
          forgotPassword: rid
        }
      })

      if (user) {
        await User.update(
          req.body,
          { where: { id: user.id },
            individualHooks: true }
        )

        res.status(200).send({
          message: 'Email Reset'
        })
      } else {
        res.status(500).send({
          error: 'An error has occured trying to reset password'
        })
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to reset password'
      })
    }
  }
}
