const Users = require('../users/users-model')
const Posts = require('../posts/posts-model')

function logger(req, res, next) {
  console.log(`${req.method} to ${req.url} at [${new Date().toISOString}]`)
  next()
}

function validateUserId(req, res, next) {
  const {id} = req.params
  Users.getById(id)
    .then(user => {
      if(user){
        req.user = user
        next()
      }
      else{
        next({status: 404, message: 'user not found'})
      }
    })
    .catch(err => next(err))
}

function validateUser(req, res, next) {
  const {name} = req.body
  if(!name){
    next({status: 400, message: "missing required name field"})
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  const {text} = req.body
  if(!text){
    next({status: 400, message: "missing required text field"})
  } else {
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}