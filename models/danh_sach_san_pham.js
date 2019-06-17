var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema(
    {
        StoreName: {type: String, required: true},
        name: {type: String, required: true, max: 100},
        price: {type: String, required: true, max: 100},
        price_sale: {type: String, max: 100},
        number: {type: String, required: true, max: 100},
        type: {type: String, required: true, max: 100},
        brand: {type: String, required: true, max: 100},
        gender: {type: String, required: true, max: 100},
        img: {type: String, required: true, max: 100},
        info: {type: String, required: true, max: 100},
        sale: {type: String, max: 100},
        TimesWatched: {type: Number, required: true, max: 100},
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
ProductSchema
    .virtual('url')
    .get(function () {
        return 'danh_sach_san_pham/thay_doi_thong_tin_san_pham/' + this._id;
    });

ProductSchema
    .virtual('delete_url')
    .get(function () {
        return 'danh_sach_san_pham/xoa_san_pham/' + this._id;
    });

ProductSchema
    .virtual('add_url')
    .get(function () {
        return 'danh_sach_san_pham/them_san_pham/';
    });

//Export model
module.exports = mongoose.model('san_phams', ProductSchema);