const express = require('express');
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
const {validatePost, validateUser, validateUserId } = require('../middleware/middleware')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  Users.get()
    .then(array => {
      res.body = array
      res.status(200).json(res.body)})
    .catch(err => next(err))
});

router.get('/:id', validateUserId, (req, res, next) => {
  if(req.user){
    res.status(200).json(req.user)
  } else {
    console.log('Dont think you can land here')
  }
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => next(err))
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, req.body)
    .then(post => res.status(200).json(post))
    .catch(err => next(err))
});

router.delete('/:id', validateUserId, (req, res, next) => {
  const {id} = req.params
  Users.getById(id)
    .then(user => {
      Users.remove(req.params.id)
        .then(count => {
          if(count === 1){
            res.status(200).json(user)
          } else {
            res.status(500).json({message: 'There was an error removing this user'})
          }
        })
        .catch(err => next(err))
    })
    .catch(err => next(err))
  
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  Users.getUserPosts(req.params.id)
    .then(posts => res.status(200).json(posts))
    .catch(err => next(err))
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  Posts.insert(req.body)
    .then(post => res.status(200).json(post))
    .catch(err => next(err))
});

module.exports = router
