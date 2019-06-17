const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var data = require('../models/danh_sach_tai_khoan');
var listProducts = require('../models/danh_sach_san_pham');
var async = require('async');

var user = "temp";
var g_listUsers = new Array();
var numPage = 0;

const bcrypt = require('bcrypt');
let saltRounds = 10
function doTheHash(pass) {
    bcrypt.hash(pass, saltRounds, (err, hash)=>{
        if(!err){
            return hash;
        }else{
            console.log('Error', err);
        }
    })
}

function doTheCompare(passInput, passReal) {
    bcrypt.compare(passInput, passReal, (err, res)=>{
        if(!err){
            return res;
        }else{
            console.log('Error', err);
        }
    })
}


exports.index = function (req, res) {
    if (req.isAuthenticated()) {
        data.find()
            .exec(function (err, list_users) {
                if (err) {
                    console.log("don't find");
                    return next(err);
                }
                //Successful, so render
                console.log("Successful, so render");
                g_listUsers = list_users;
                //console.log(list_users);
                //res.render('danh_sach_tai_khoan', {title: '', list_items: list_items});
                res.render('danh_sach_tai_khoan', {
                    title: '',
                    list_users: list_users,
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

exports.infor = async (req, res, next) => {
    console.log({_id:req.params.id})
    data.find({_id:req.params.id})
        .exec(function (err, item) {
            if (err) {
                console.log("don't find");
                return next(err);
            }
            //Successful, so render
            console.log("thong_tin_chi_tiet_tai_khoan");
            console.log(item);
            //res.render('danh_sach_tai_khoan', {title: '', list_items: list_items});
            res.render('thong_tin_chi_tiet_tai_khoan', {title: '', item: item[0], user: req.user});
        });
};
exports.show_list = function(req, res, next) {

    data.find()
        .exec(function (err, list_items) {
            if (err) {
                console.log("falseeee");
                return next(err);
            }
            //Successful, so render
            console.log("Successful, so render");
            console.log(list_items);
            res.render('danh_sach_tai_khoan', {title: '', list_items: list_items});
        });
};

exports.show_info = async (req, res, next) => {
    console.log({_id:req.params.id})
    data.find({_id:req.params.id})
        .exec(function (err, item) {
            if (err) {
                console.log("failseeee");
                return next(err);
            }
            //Successful, so render
            else {
                if (item==null) { // No results.
                    var err = new Error('Item not found');
                    err.status = 404;
                    return next(err);
                }
                console.log("Thay đổi thông tin tài khoản");
                console.log(item);
                res.render('thay_doi_thong_tin_tai_khoan', {title: 'Áo Khoác', item: item[0], user: req.user})
            };
        });
};


// Handle book update on POST.
exports.update_post = [
    // Validate fields.
    body('name', 'name required').isLength({ min: 1 }).trim(),
    body('password', 'password required').isLength({ min: 1 }).trim(),
    body('email', 'email required').isLength({ min: 1 }).trim(),
    body('phone', 'phone required').isLength({ min: 1 }).trim(),
    body('date', 'date required').isLength({ min: 1 }).trim(),
    body('address', 'address required').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('password').escape(),
    sanitizeBody('email').escape(),
    sanitizeBody('phone').escape(),
    sanitizeBody('date').escape(),
    sanitizeBody('address').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var account = new data(
            {
                name: req.body.name,
                password : req.body.password,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                date: req.body.date,
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
                        if (account.name.indexOf(results.genres[i]._id) > -1) {
                            results.name[i].checked='true';
                        }
                    }
                    res.render('/thay_doi_thong_tin_tai_khoan', { title: 'Update Book', item : results.name, errors: errors.array(), user:req.user });
                });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            data.findByIdAndUpdate(req.params.id, account, {}, function (err,item) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect('/danh_sach_tai_khoan');
            });
        }
    }
];

exports.delete_post = function(req, res, next) {
    data.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
        if (err) {
            console.log("Delete false");
            return next(err); }
        // Success - go to author list
        res.redirect('/danh_sach_tai_khoan')
    });
};

exports.check_log_in = function(req, res, next) {
    data.find({"name":req.body.name})
        .exec(function (err, item) {
            if (err) {
                err.status = 404;
                return next(err);
            }
            //Successful, so render
            else {
                if(item.length == 0)
                {
                    console.log("false 2");
                    res.render('dang_nhap', { title: 'Sai thông tin đăng nhập' });
                }
                else {
                    console.log("Successful");
                    if (doTheCompare(req.body.password, item[0].password)){
                        res.render('dang_nhap', {title: 'Sai thông tin đăng nhập'});
                    } else {
                        console.log("Successful, so render");
                        console.log(item);
                        user = item[0].name;
                        res.render('main', {title: 'Áo Khoác', user: item[0]})
                    }
                }
            };
        });
};

exports.sign_in = [

    // Validate that the name field is not empty.
    body('name', 'name required').isLength({ min: 1 }).trim(),
    body('password', 'name required').isLength({ min: 1 }).trim(),
    //console.log("check"),
    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),
    sanitizeBody('password').escape(),
    //console.log("escape"),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var account = new data(
            {
                name: req.body.name,
                password: doTheHash(req.body.password),
                email: req.body.email,
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            console.log("error");
            res.render('dang_ky', { title: 'Không được bỏ trống'});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            data.findOne({ 'name': req.body.name })
                .exec( function(err, found_account) {
                    if (err) {
                        console.log("error exec");
                        return next(err); }

                    if (found_account) {
                        // Genre exists, redirect to its detail page.
                        res.render('dang_ky', { title: 'Tên đã tồn tại'});
                    }
                    else {

                        account.save(function (err) {
                            if (err) {
                                console.log("error save");
                                return next(err); }
                            // Genre saved. Redirect to genre detail page.
                            console.log("success");
                            res.render('main', {user: account})
                        });

                    }

                });
        }
    }
];

exports.add =  [

    // Validate that the name field is not empty.
    body('name', 'name required').isLength({ min: 1 }).trim(),
    //console.log("check"),
    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),
    //console.log("escape"),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        //  var newListProducts = new Array()
        // var totalcost = null;
        // Create a genre object with escaped and trimmed data.
        var account = new data(
            { name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
                date: req.body.date,
                // listProducts:newListProducts,
                // totalCost: totalcost,
                _id:req.params.id}
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            console.log("error");
            res.render('/them_tai_khoan', { title: 'Create Genre', genre: account, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            data.findOne({ 'name': req.body.name })
                .exec( function(err, found_account) {
                    if (err) {
                        console.log("error exec");
                        return next(err); }

                    if (found_account) {
                        // Genre exists, redirect to its detail page.
                        res.redirect(found_account.url);
                    }
                    else {

                        account.save(function (err) {
                            if (err) {
                                console.log("error save");
                                return next(err); }
                            // Genre saved. Redirect to genre detail page.
                            console.log("success");
                            res.redirect('/danh_sach_tai_khoan');
                        });

                    }

                });
        }
    }
];

exports.moveNextPage = function(req, res, next){
    numPage = req.query.id;
    //res.redirect('/');
    //renderPage(req, res, list);
    if (req.isAuthenticated()) {
        res.render('danh_sach_tai_khoan', {
            title: '',
            list_users: g_listUsers,
            user: req.user,
            numPage: numPage
        }); }
    else {
       res.redirect('/');
        }
}