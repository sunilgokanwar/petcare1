const express = require('express');
const usersRoutes = require('./users.route');
const petsRoutes = require('./pet.routes');

const router = express.Router();

router.get('/', (req, res) => res.send('Welcome to My App !!'));
router.use('/users', usersRoutes);
router.use('/pets',petsRoutes);

//router.use('/v1/users', usersRoutes);

module.exports = router;