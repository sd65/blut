var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var journeySchema = new Schema({
    fromLatLng: Array,
    fromAddress: String,
    fromCity: String,
    toLatLng: Array,
    toAddress: String,
    toCity: String,
    datetime: Date,
    datetimeArrival: Date,
    returnDatetime: Date,
    returnDatetimeArrival: Date,
    twoWay: Boolean,
    availableSeats: Number,
    price: Number,
    comment: String,
    driverFullName: String,
    driverLogin: String,
    distance: String,
    duration: String,
});

module.exports = mongoose.model('journeySchema', journeySchema);
