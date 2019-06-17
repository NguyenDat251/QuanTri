var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShopSchema = new Schema(
    {

        name: {type: String, required: true, max: 100},

    }
);

// Virtual for author's full name
// SanphamShecma
//     .virtual('name')
//     .get(function () {
//         return this.family_name + ', ' + this.first_name;
//     });
//
// // Virtual for author's lifespan
// SanphamShecma
//     .virtual('lifespan')
//     .get(function () {
//         return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
//     });
//
// Virtual for author's URL
ShopSchema
    .virtual('url')
    .get(function () {
        return '/danh_sach_cua_hang/thay_doi_thong_tin_cua_hang/' + this._id;
    });

ShopSchema
    .virtual('delete_url')
    .get(function () {
        return '/danh_sach_cua_hang/xoa_cua_hang/' + this._id;
    });
ShopSchema
    .virtual('add_url')
    .get(function () {
        return '/danh_sach_cua_hang/them_cua_hang/';
    });

//Export model
module.exports = mongoose.model('cua_hangs', ShopSchema);