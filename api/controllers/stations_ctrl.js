//-------------------------------------------------------------
const Station  = require('../models/station_model');
const mongoose = require('mongoose');
//-------------------------------------------------------------

// GET all stations
exports.stations_get_all = (req, res, next) => {
    Station
        .find()
        .exec()
        .then(docs => {
            const response = {
                count:   docs.length,
                stations: docs.map(doc => {
                    return {
                        Nome:      doc.Nome,
                        Comune:    doc.Comune,
                        //Provincia: doc.Provincia,
                        Regione:   doc.Regione,
                        //Anno_inserimento: doc.Anno_inserimento,
                        //Data_inserimento: doc.Data_inserimento,
                        //ID_OpenStreetMap: doc.ID_OpenStreetMap,
                        //Longitudine: doc.Longitudine,
                        //Latitudine:  doc.Latitudine,
                        _id: doc._id,
                        request: {
                            description: "To view this station",
                            type: 'GET',
                            url: 'https://progetto-pdgt-federici.herokuapp.com/stations/' + doc._id
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
// GET one station
exports.stations_get_one = (req, res, next) => {
    const id = req.params.stationId;

    Station
        .findById(id)
        .exec()
        .then(doc => {
            if(doc){
                const response = {
                    station: doc,
                    request: {
                        decription: 'To view ALL station',
                        type: 'GET',
                        url: 'https://progetto-pdgt-federici.herokuapp.com/stations/'
                    }
                }
                res.status(200).json(response);

            }else{
                const response = { message: "No valid entry found for provided ID" }
                res.status(404).json(response);
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            }); 
        });
}

// GET station with differet type of request
exports.stations_get_many = (req, res, next) => {
    const option    = req.params.option;
    const parameter = req.params.parameter;
    let findkey = {}

    //console.log(req.params.option)
    if(option === "name"){
        findkey = {Nome: parameter}
    }else if(option === "region"){
        findkey = {Regione: parameter}
    }else if(option === "province"){
        findkey = {Provincia: parameter}
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
                            url: 'https://progetto-pdgt-federici.herokuapp.com/stations/' + doc._id
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