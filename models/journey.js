var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var journeySchema = new Schema({
    from: String,
    to: String,
    datetime: Date
});

module.exports = mongoose.model('journeySchema', journeySchema);
