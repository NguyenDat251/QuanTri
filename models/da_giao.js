var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var theEnd = new Schema(
    {

        id_store : {type: String, required: true, max: 100},
        id_product: {type: String},
        number: {type: Number},
        totalPrice: {type: String},
        id_receiver: {type: String},
    }
);

//Export model
module.exports = mongoose.model('da_giaos', theEnd);