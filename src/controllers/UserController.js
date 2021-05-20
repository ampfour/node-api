const fs = require('fs')
const { User } = require('../models')
const Op = require('Sequelize').Op

module.exports = {
  async getUsers (req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password', 'forgotPassword', 'createdAt', 'updatedAt'] },
        order: [
          [ 'lastName', 'ASC' ],
          [ 'firstName', 'ASC' ]
        ]
      })

      for (var i in users) {
        if (users[i].image) {
          let filename = 'public/images/members/' + users[i].image

          try {
            fs.accessSync(filename, fs.constants.F_OK)
            // console.log('can read/write')
          } catch (err) {
            users[i].image = ''
            users[i].picture = ''
            // console.log(filename)
          }
        }
      }

      res.send(users)
    } catch (err) {
      // throw err
      res.status(400).send({
        error: 'There are not users in system.'
      })
    }
  },

  async getUser (req, res) {
    console.log(req.params)
    try {
      const user = await User.findByPk(req.params.userId, {
        attributes: { exclude: ['password', 'forgotPassword', 'createdAt', 'updatedAt'] }
      })

      res.send(user.toJSON())
    } catch (err) {
      res.status(404).send({
        error: 'User Not Found.'
      })
    }
  },

  async addUser (req, res) {
    try {
      let today = new Date().toISOString().slice(0, 10)
      const user = await User.create(req.body)

      if (req.body.dataUrl) {
        let image = user.id + '-' + req.body.lastName + '_' + req.body.firstName + '.jpg'

        let base64Image = req.body.dataUrl.split(';base64,').pop()
        fs.writeFile('public/images/members/' + image, base64Image, {encoding: 'base64'}, (err) => {
          if (err) throw err
          req.body.image = image
        })

        await user.update({
          image: image
        })
      }

      await UserTitle.create({
        date: today,
        UserId: user.id,
        TitleId: '4'
      })

      res.status(201).send({
        message: req.body.firstName + ' ' + req.body.lastName + ' was added successfully.',
        user: user
      })
    } catch (err) {
      res.status(400).send({
        error: 'This user could not be added.'
      })
    }
  },

  async updateUser (req, res) {
    try {
      let image = req.params.userId + '-' + req.body.lastName + '_' + req.body.firstName + '.jpg'

      await User.findByPk(req.params.userId)
        .then(
          user => {
            if (!user) {
              return res.status(404).json({
                error: 'User Not Found'
              })
            }

            if (req.body.dataUrl) {
              req.body.image = image

              let base64Image = req.body.dataUrl.split(';base64,').pop()
              fs.writeFile('public/images/members/' + image, base64Image, {encoding: 'base64'}, (err) => {
                if (err) throw err
              })
            }

            return user.update(req.body)
              .then(() => res.status(200).send({
                message: 'User was updated successfully.',
                body: req.body,
                user: user
              }))
              .catch((error) => res.status(400).send(error))
          }
        )
    } catch (err) {
      res.status(400).send({
        error: 'The User could not be updated.'
      })
    }
  },

  async deleteUser (req, res) {
    try {
      return User.destroy({
        where: {
          id: req.params.userId
        }
      })
        .then(() => {
          res.status(200).send({
            message: 'The User was deleted successfully.'
          })
        })
        .catch((error) => res.status(400).send(error))
    } catch (err) {
      res.status(400).send({
        error: 'The User could not be deleted.'
      })
    }
  }
}
