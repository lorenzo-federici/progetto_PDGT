const Station  = require('../models/station_model');
//const mongoose = require('mongoose');

// GET all stations
exports.stations_get_all = (req, res, next) => {
    Station
        .find()
        .exec()
        .then(docs => {
            const response = {
                count:   docs.length,
                product: docs.map(doc => {
                    return {
                        //Comune:    doc.Comune,
                        //Provincia: doc.Provincia,
                        Regione:   doc.Regione,
                        Nome:      doc.Nome,
                        //Anno_inserimento: doc.Anno_inserimento,
                        //Data_inserimento: doc.Data_inserimento,
                        //ID_OpenStreetMap: doc.ID_OpenStreetMap,
                        //Longitudine: doc.Longitudine,
                        //Latitudine:  doc.Latitudine,
                        _id: doc._id,
                        request: {
                            description: "To view this station",
                            type: 'GET',
                            url: 'http://localhost:3000/stations/' + doc._id
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