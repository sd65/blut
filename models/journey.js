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
    returnDatetime: Date,
    twoWay: Boolean,
    availableSeats: Number,
    price: Number,
    comment: String,
    driverFullName: String,
    driverLogin: String,
});

module.exports = mongoose.model('journeySchema', journeySchema);
