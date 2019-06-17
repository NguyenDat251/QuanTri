var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountSchema = new Schema(
    {
        isVerified: { type: Boolean, default: false },
        name: {type: String, required: 'Vui lòng không để trống', max: 100},
        password: {type: String},
        email:{type: String},
        phone:{type: String},
        address:{type: String},
        date: {type: String},

    }
);

AccountSchema
    .virtual('url')
    .get(function () {
        return '/danh_sach_tai_khoan/thay_doi_thong_tin_tai_khoan/' + this._id;
    });

AccountSchema
    .virtual('delete_url')
    .get(function () {
        return '/danh_sach_tai_khoan/xoa_tai_khoan/' + this._id;
    });

AccountSchema
    .virtual('add_url')
    .get(function () {
        return '/danh_sach_tai_khoan/them_tai_khoan/';
    });

AccountSchema
    .virtual('infor_url')
    .get(function () {
        return '/danh_sach_tai_khoan/thong_tin_chi_tiet_tai_khoan/' + this._id;
    })
//Export model
module.exports = mongoose.model('tai_khoans', AccountSchema);