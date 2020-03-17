//-------------------------------------------------------------
const express = require('express');
const router  = express.Router();

const checkAuth = require('../middleware/check-auth'); //authorization 
const StationController = require('../controllers/stations_ctrl');
//-------------------------------------------------------------


//-------------------------------------------------------------
router.get('/', StationController.stations_get_all);
router.get('/:stationId', StationController.stations_get_one);
router.post('/', checkAuth, StationController.stations_add_stations);
router.delete('/:stationId', checkAuth, StationController.stations_delete_station);
router.patch('/:stationId', checkAuth, StationController.stations_update_stations);
//-------------------------------------------------------------

module.exports = router;