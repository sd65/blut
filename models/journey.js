var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var journeySchema = new Schema({
    fromLatLng: { type: [Number], index: "2d", required: true },
    fromAddress: { type: String, required: true },
    fromCity: { type: String, required: true },
    toLatLng: { type: [Number], index: "2d", required: true },
    toAddress: { type: String, required: true },
    toCity: { type: String, required: true },
    datetime: { type: Date, required: true },
    datetimeArrival: { type: Date, required: true },
    twoWay: { type: Boolean, required: true },
    returnDatetime: { type: Date, required: false, validate : [dateValidator, "La date de retour doit être intérieure à la date de départ" ]},
    returnDatetimeArrival: { type: Date, required: false },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true, min : [1, "Le prix doit être supérieur à 1€"] },
    comment: { type: String, required: false },
    driverFullName: { type: String, required: true },
    driverLogin: { type: String, required: true },
    distance: { type: String, required: true },
    duration: { type: String, required: true },
});

function dateValidator(value) {
      return this.datetime <= value;
}

module.exports = mongoose.model('journeySchema', journeySchema);
