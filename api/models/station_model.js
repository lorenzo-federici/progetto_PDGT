const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
    _id:   mongoose.Schema.Types.ObjectId,
    Comune: { type: String, required: true },
    Provincia: { type: String, required: true },
    Regione: { type: String, required: true },
    Nome: { type: String, required: true },
    Anno_inserimento: { type: Number, required: true },
    Data_inserimento: { type: String, required: true },
    ID_OpenStreetMap: { type: Number, required: true },
    Longitudine: { type: Number, required: true },
    Latitudine: { type: Number, required: true }
});

module.exports = mongoose.model('Station', stationSchema);