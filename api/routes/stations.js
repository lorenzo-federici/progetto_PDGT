//-------------------------------------------------------------
const express = require('express');
const router  = express.Router();

const checkAuth = require('../middleware/check-auth'); //authorization 
const StationController = require('../controllers/stations_ctrl');
//-------------------------------------------------------------


//-------------------------------------------------------------
router.get('/view/:option', StationController.stations_get_stations);
router.get('/near/', StationController.stations_get_one_near);
router.post('/', checkAuth, StationController.stations_add_stations);
router.delete('/:stationId', checkAuth, StationController.stations_delete_station);
router.patch('/:stationId', checkAuth, StationController.stations_update_stations);
//-------------------------------------------------------------

module.exports = router;