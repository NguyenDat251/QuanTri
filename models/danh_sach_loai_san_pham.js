var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TypeSchema = new Schema(
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
TypeSchema
    .virtual('url')
    .get(function () {
        return '/danh_sach_loai_san_pham/thay_doi_thong_tin_loai_san_pham/' + this._id;
    });

TypeSchema
    .virtual('delete_url')
    .get(function () {
        return '/danh_sach_loai_san_pham/xoa_loai_san_pham/' + this._id;
    });

TypeSchema
    .virtual('add_url')
    .get(function () {
        return '/danh_sach_loai_san_pham/them_loai_san_pham/';
    });

//Export model
module.exports = mongoose.model('loai_sps', TypeSchema);