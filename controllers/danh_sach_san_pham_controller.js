const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var data = require('../models/danh_sach_san_pham');
var dataCuaHang = require('../models/danh_sach_cua_hang');
var async = require('async');
var g_listShops = new Array();
var numPage = 0;
var g_listItems = new Array();
var g_listTypes = new Array();
var g_listBrands = new Array();

exports.index = function(req, res, next) {
    if (req.isAuthenticated()) {
        async.parallel({
            listItems: function(callback) {
                data.find()
                    .exec(callback);
            },

            listTypes: function(callback) {
                data.distinct("type")
                    .exec(callback);
            },

            listBrands: function(callback) {
                data.distinct("brand")
                    .exec(callback);
            },

        }, function(err, results) {
            if (err) { res.direct('/danh_sach_san_pham'); }
            if (results.listItems==null) { // No results.
                var err = new Error('list not found');
                err.status = 404;
                res.direct('/danh_sach_san_pham');
            }
                //Successful, so render
                console.log("Successful, so render");
                //console.log(list_items);
                g_listItems = results.listItems;
                g_listTypes = results.listTypes;
                g_listBrands = results.listBrands;
                res.render('danh_sach_san_pham', {
                    title: '',
                    list_items: g_listItems,
                    list_types: g_listTypes,
                    list_brands: g_listBrands,
                    user: req.user,
                    numPage: numPage
                });
            });

    } else {
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.render('dang_nhap', {
            errorText: ''
        });
    }
};

exports.show_info_add_product = function(req, res, next) {
    if (req.isAuthenticated()) {
        dataCuaHang.find()
            .exec(function (err, list_shops) {
                if (err) {
                    console.log("falseeee");
                    return next(err);
                }
                //Successful, so render
                console.log("Successful, so render");
                g_listShops = list_shops;
                console.log(list_shops);
                res.render('them_san_pham', { title: 'Express', user: req.user, list_shops: g_listShops });
            });

    } else {
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.render('dang_nhap', {
            errorText: ''
        });
    }
};

exports.moveNextPage = function(req, res, next) {
    console.log("vào phân page");
    numPage = req.query.id;
    //res.redirect('/');
    //renderPage(req, res, list);
    if (req.isAuthenticated()) {
        res.redirect('danh_sach_san_pham');
    }
    else {
        res.redirect('/');
    }
};
exports.search = function(req, res, next) {
    var strType = req.body.selectedType;
    var strBrand = req.body.selectedBrand;
    var strGender = req.body.selectedGender;

    var tempList = new Array();
    console.log(g_listItems);
    for (let item of g_listItems) {
        if ((item.type == strType || strType == "Tất cả")
            && (item.brand == strBrand || strBrand == "Tất cả")
            && (item.gender == strGender || strGender == "Tất cả")) {
            tempList.push(item);
        }


    }
    res.render('danh_sach_san_pham', {
        title: '',
        list_items: tempList,
        list_types: g_listTypes,
        list_brands: g_listBrands,
        user: req.user,
        numPage: numPage
    });
}


exports.show_info = async (req, res, next) => {
    data.find({_id:req.params.id})
        .exec(function (err, item) {
            if (err) {
                console.log("falseeee");
                return next(err);
            }
            //Successful, so render
            else {
                if (item==null) { // No results.
                    var err = new Error('Item not found');
                    err.status = 404;
                    return next(err);
                }
                console.log("Successful, so render");
                console.log(item);
                res.render('thay_doi_thong_tin_san_pham', {
                    title: 'Áo Khoác',
                    item: item[0],
                    user: req.user,
                    list_shops: g_listShops
                })
            }
            ;


        });
};


// Handle book update on POST.
exports.update_post = [
    // Validate fields.
    body('name', 'name required').isLength({ min: 1 }).trim(),
    body('price', 'price required').isLength({ min: 1 }).trim(),
    body('price_sale', 'price required').isLength({ min: 1 }).trim(),
    body('number', 'number required').isLength({ min: 1 }).trim(),

    body('brand', 'brand required').isLength({ min: 1 }).trim(),
    body('number', 'number required').isLength({ min: 1 }).trim(),

    body('img', 'img required').isLength({ min: 1 }).trim(),
    body('info', 'info required').isLength({ min: 1 }).trim(),


    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('price').escape(),
    sanitizeBody('price_sale').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('brand').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('info').escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var goods = new data(
            { StoreName: req.body.StoreName,
                name: req.body.name,
                price: req.body.price,
                price_sale: req.body.price_sale,
                number: req.body.number,
                type: req.body.type,
                brand: req.body.brand,
                gender: req.body.gender,
                img: req.body.img,
                info: req.body.info,
                sale: req.body.sale,
                TimesWatched: req.body.timesWatched,
                _id:req.params.id //This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({

                },
                function(err, results) {
                    if (err) { return next(err); }


                    for (let i = 0; i < results.name.length; i++) {
                        if (goods.name.indexOf(results.genres[i]._id) > -1) {
                            results.name[i].checked='true';
                        }
                    }
                    res.render('/thay_doi_thong_tin_san_pham', { title: 'Update Book', item : results.name, errors: errors.array(), user: req.user });
                });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            data.findByIdAndUpdate(req.params.id, goods, {}, function (err,item) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect('/danh_sach_san_pham');
            });
        }
    }
];

exports.delete_post = function(req, res, next) {

    // async.parallel({
    //
    // }, function(err, results) {
    //     if (err) {
    //         console.log("connect false");
    //         return next(err); }
    //     // Success
    //
    //     else {
    //         // Author has no books. Delete object and redirect to the list of authors.
    data.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
        if (err) {
            console.log("Delete false");
            return next(err); }
        // Success - go to author list
        res.redirect('/danh_sach_san_pham')
    });


};


exports.add =  [

    // Validate that the name field is not empty.
    body('name', 'name required').isLength({ min: 1 }).trim(),
    body('price', 'price required').isLength({ min: 1 }).trim(),
    body('price_sale', 'price required').isLength({ min: 1 }).trim(),
    body('number', 'number required').isLength({ min: 1 }).trim(),

    body('brand', 'brand required').isLength({ min: 1 }).trim(),
    body('number', 'number required').isLength({ min: 1 }).trim(),

    body('img', 'img required').isLength({ min: 1 }).trim(),
    body('info', 'info required').isLength({ min: 1 }).trim(),
    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),
    sanitizeBody('price').escape(),
    sanitizeBody('price_sale').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('brand').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('info').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var goods = new data(
            {
                StoreName: req.body.StoreName,
                name: req.body.name,
                price: req.body.price,
                price_sale: req.body.price_sale,
                number: req.body.number,
                type: req.body.type,
                brand: req.body.brand,
                gender: req.body.gender,
                img: req.body.img,
                info: req.body.info,
                sale: req.body.sale,
                TimesWatched: 1,}
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            console.log(errors);
            res.redirect('them_san_pham');
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            data.findOne({ 'name': req.body.name })
                .exec( function(err, found_name) {
                    if (err) {
                        console.log("error exec");
                        res.redirect('them_san_pham'); }

                    if (found_name) {
                        // Genre exists, redirect to its detail page.
                        res.redirect('them_san_pham');
                    }
                    else {

                        goods.save(function (err) {
                            if (err) {
                                console.log("error save");
                                res.redirect('them_san_pham');}
                            // Genre saved. Redirect to genre detail page.
                            console.log("success");
                            res.redirect('/danh_sach_san_pham');
                        });

                    }

                });
        }
    }
];