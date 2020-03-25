//-------------------------------------------------------------
const Station  = require('../models/station_model');
const mongoose = require('mongoose');
const axios = require('axios');
const geolib = require('geolib');
//-------------------------------------------------------------

// GET station with differet type of request
exports.stations_get_stations = (req, res, next) => {
    const option    = req.params.option;
    const parameter = (option === "id") ? req.query.prm : (new RegExp('\\b' + req.query.prm + '\\b', 'i'));
    let findkey     = {}

    switch (option) {
        case "name":
            findkey = {Nome: parameter}
            break;
        case "region":
            findkey = {Regione: parameter}
             break;
        case "province":
            findkey = {Provincia: parameter}
            break;
        case "id":
            findkey = {_id: req.query.prm}
            break;
        default:
            findkey = {}
            break;
      }
    Station
        .find(findkey)
        .exec()
        .then(docs => {
            const response = {
                count:   docs.length,
                stations: docs.map(doc => {
                    return {
                        Nome:      doc.Nome,
                        Comune:    doc.Comune,
                        Provincia: doc.Provincia,
                        Regione:   doc.Regione,
                        Longitudine: doc.Longitudine,
                        Latitudine:  doc.Latitudine,
                        _id: doc._id,
                        request: {
                            description: "To view this station",
                            type: 'GET',
                            url: 'https://progetto-pdgt-federici.herokuapp.com/stations/id?prm=' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            }); 
        });
}
// Create new station
// Todo: add control for administrators only
exports.stations_add_stations = (req, res, next) => {
    //aggiunta sul db
    let datetime = new Date();
    const station = new Station({
        _id:   new mongoose.Types.ObjectId(),
        Comune:    req.body.Comune,
        Provincia: req.body.Provincia,
        Regione:   req.body.Regione,
        Nome:      req.body.Nome,
        Anno_inserimento: datetime.getFullYear(),
        Data_inserimento: datetime,
        ID_OpenStreetMap: req.body.ID_OpenStreetMap,
        Longitudine: req.body.Longitudine,
        Latitudine:  req.body.Latitudine,
    });
    
    station
        .save()
        .then(result => {
            const response = {
                message: "Station added successfully",
                addedStation: {
                    Comune:    result.Comune,
                    Provincia: result.Provincia,
                    Regione:   result.Regione,
                    Nome:      result.Nome,
                    Anno_inserimento: result.Anno_inserimento,
                    Data_inserimento: result.Data_inserimento,
                    ID_OpenStreetMap: result.ID_OpenStreetMap,
                    Longitudine: result.Longitudine,
                    Latitudine:  result.Latitudine,
                    _id: result._id
                },
                request: {
                    description: "To view it",
                    type: 'GET',
                    url: 'https://progetto-pdgt-federici.herokuapp.com/stations/' + result._id
                }
            }
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            }); 
        }); 
}
// Delete specific station
// Todo: add control for administrators only
exports.stations_delete_station = (req, res, next) => {
    const id = req.params.stationId;

    Station.findByIdAndRemove(id, (error, product) => {
        if (error) return res.status(500).send(error);

        const response = {
            message: "Station successfully deleted",
            request: {
                decription: 'To view ALL station',
                type: 'GET',
                url: 'https://progetto-pdgt-federici.herokuapp.com/stations/'
            }
        };
        return res.status(200).send(response);
    });

}
// Update specific station
// Todo: add control for administrators only
exports.stations_update_stations = (req, res, next) => {
    const id = req.params.stationId;
    const updateOps = {};

    const newStation = new Station({
        Comune:    req.body.Comune,
        Provincia: req.body.Provincia,
        Regione:   req.body.Regione,
        Nome:      req.body.Nome,
        Anno_inserimento: req.body.Anno_inserimento,
        Data_inserimento: req.body.Data_inserimento,
        ID_OpenStreetMap: req.body.ID_OpenStreetMap,
        Longitudine: req.body.Longitudine,
        Latitudine:  req.body.Latitudine,
    });
    
    Station
        .updateOne({_id: id},{$set: newStation })
        .exec()
        .then(result => {
            const response = {
                message: 'Station updated',
                request: {
                    type: 'GET',
                    url: 'https://progetto-pdgt-federici.herokuapp.com/stations/' + id
                }
            }
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            }); 
        });
}
// GET one station with longitude & latitude
exports.stations_get_one_near = (req, res, next) => {
    const latitude = req.query.lat;
    const longitude = req.query.long;
    
    var home = {
        latitude: latitude,
        longitude: longitude
    };

    const params = {
        locate: latitude+","+longitude,
        json: '1'
    }

    axios.get('https://geocode.xyz', {params})
    .then(response => {
        //console.log(response.data.alt.loc.prov);

        const parameter = new RegExp('\\b' + response.data.alt.loc.prov + '\\b', 'i');
        let findkey = {Regione: parameter}
        
        Station
            .find(findkey)
            .exec()
            .then(docs => {
                const response = {
                    count:   docs.length,
                    stations: docs.map(doc => {
                        return {
                            Nome:      doc.Nome,
                            Comune:    doc.Comune,
                            Provincia: doc.Provincia,
                            Regione:   doc.Regione,
                            Longitudine: doc.Longitudine,
                            Latitudine:  doc.Latitudine,
                            _id: doc._id,
                            request: {
                                description: "To view this station",
                                type: 'GET',
                                url: 'https://progetto-pdgt-federici.herokuapp.com/stations/' + doc._id
                            }
                        }
                    })
                };
                
                res.status(200).json(getNearStation(home, response.count, response.stations));
            })
            .catch(error => {
                res.status(500).json({
                    error: error
                }); 
            });
    }).catch(error => {
        console.log(error);
    });

}

function getNearStation(home,number, stations){
    let i = 1
    let j = 0
    let destination = [
        {
            lat: stations[0].Latitudine,
            lon: stations[0].Longitudine
        },{
            lat: stations[1].Latitudine,
            lon: stations[1].Longitudine
        }
    ];

    do{
        if((geolib.getDistance( home, destination[1])/1000) < (geolib.getDistance( home, destination[0])/1000)){
            destination[0] = destination[1]
            j=i
        }
        destination[1] = {
            lat: stations[i].Latitudine,
            lon: stations[i].Longitudine
        }
        i++;
    }while(i < number)

    return stations[j]
    
}

