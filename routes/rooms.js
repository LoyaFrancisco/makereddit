const express = require('express');
const router = express.Router();

const auth = require('./helpers/auth');
const Room = require('../models/room');

// Rooms index
router.get('/', (req, res, next) => {
  Room.find({}, 'topic', function(err, rooms) {
    if(err) {
      console.error(err);
    } else {
      res.render('rooms/index', { rooms: rooms });
    }
  });
});

// Rooms new
router.get('/new', auth.requireLogin, (req, res, next) => {
  res.render('rooms/new');
});

// Rooms show
// from the directory of a specific room's id, handle the request
  // and render that specific room
router.get('/:id', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.id, function(err, room) {
    if(err) { console.error(err) };

    res.render('rooms/show', { room: room });
  });
});

// Rooms edit
router.get('/:id/edit', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params, function(err, room){
    if(err) {console.error(err)};

    res.render('rooms/edit', {room: room});
  });
});

// Rooms update
router.post('/:id', auth.requireLogin, (req, res, next) => {
  Room.findByIdAndUpdate(req.params.id, req.body, function(err, room) {
    if(err) {console.error(err)};

    res.redirect('/rooms/' + req.params.id);
  });
});

// Rooms create
router.post('/', auth.requireLogin, (req, res, next) => {
  let room = new Room(req.body); // create a new room model

  //save the model and pass a callback that redirects the user
    // to the Rooms index
  room.save(function(err, room) {
    if(err) {console.error(err)};
    return res.redirect('/rooms');
  });
});

module.exports = router;