//-------------------------------------------------------------
const express = require('express');
const router  = express.Router();

const checkAuth = require('../middleware/check-auth'); //authorization 
const StationController = require('../controllers/stations_ctrl');
//-------------------------------------------------------------


//-------------------------------------------------------------
router.get('/:option', StationController.stations_get_stations);
router.post('/', checkAuth, StationController.stations_add_stations);
router.delete('/:stationId', checkAuth, StationController.stations_delete_station);
router.patch('/:stationId', checkAuth, StationController.stations_update_stations);

//router.get('/near/:latitude/:longitude', StationController.stations_get_one_near);
router.get('/near', StationController.stations_get_one_near);
//-------------------------------------------------------------

module.exports = router;