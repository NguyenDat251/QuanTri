var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountSchema = new Schema(
    {
        name: {type: String},
        email:{type: String},
        password: {type: String},
    }
);

// Virtual for author's URL
AccountSchema
    .virtual('url')
    .get(function () {
        return '/thay_doi_thong_tin_admin/';
    });

AccountSchema

    .virtual('add_url_admin')
    .get(function () {
        return '/them_tai_khoan_admin/';
    });

AccountSchema
    .virtual('detail_url')
    .get(function () {
        return '/thong_tin_admin/';
    })
//Export model
module.exports = mongoose.model('admins', AccountSchema);