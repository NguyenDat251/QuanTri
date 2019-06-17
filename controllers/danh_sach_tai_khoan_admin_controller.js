const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var data = require('../models/danh_sach_tai_khoan_admin');
var async = require('async');
var user = "temp";

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


exports.show_info = async (req, res, next) => {
    console.log("SHOW_INFOR");
    if (req.isAuthenticated()) {
        data.find()
            .exec(function (err, item) {
                if (err) {
                    console.log("falseeee");
                    return next(err);
                }
                //Successful, so render
                console.log("Successful, so render");
                console.log(item[0]);

                res.render('thay_doi_thong_tin_admin', {title: '', item: item[0], user: req.user});
            });

    } else {
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.render('dang_nhap', {
            errorText: ''
        });
    }
};

exports.detail = async (req, res, next) => {
    console.log("DETAIL");
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
                console.log(item[0]);
                res.render('thong_tin_admin', {title: 'Áo Khoác', item: item[0], user: req.user})
            }
            ;
        });
          // res.render('thay_doi_thong_tin_admin', {title: 'Áo Khoác', user: req.user})
};

exports.update_post = [
    // Validate fields.
     body('email', 'Name must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('email').escape(),

    // Process request after validation and sanitization.
     (req, res, next) => {
         console.log("UPDATE");
         // Extract the validation errors from a request.
         const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var account = new data(
            {
                name:req.user.name,
                email: req.body.email,
                _id:req.user.id //This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            console.log("ERROR")
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({

                },
                function(err, results) {
                    if (err) { return next(err); }


                    for (let i = 0; i < results.name.length; i++) {
                        if (account.name.indexOf(results.genres[i]._id) > -1) {
                            results.e[i].checked='true';
                        }
                    }
                    res.render('/thay_doi_thong_tin_admin', { title: 'Update Book', item : results.name, errors: errors.array() });
                });
            return;
        }
        else {
          //Data from form is valid. Update the record.
            data.findByIdAndUpdate(req.params.id, account, {}, function (err,item) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect('/main');

            });
        }
  }
];

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
            }
            ;


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
        console.log("form đăng ký = post");
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

        // Create a genre object with escaped and trimmed data.
        var account = new data(
            { name: req.body.name,
            password: req.body.password,
            email: req.body.email,}
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

exports.confirmationPost = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('token', 'Token cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
 
    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);
 
    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};

