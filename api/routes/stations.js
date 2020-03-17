const express = require('express');
const router  = express.Router();
//const mongoose = require('mongoose');

const StationController = require('../controllers/stations_ctrl');

router.get('/', StationController.stations_get_all);

module.exports = router;