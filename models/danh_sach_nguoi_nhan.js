var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CartItemSchema = new Schema(
    {
        name_receiver: {type: String},
        phone_receiver:{type: String},
        address_receiver: {type: String},
    }
);

//Export model
module.exports = mongoose.model('nguoi_nhans', CartItemSchema);