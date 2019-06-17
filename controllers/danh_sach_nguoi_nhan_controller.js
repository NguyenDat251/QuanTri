const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var data = require('../models/danh_sach_nguoi_nhan');
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


exports.index = function (req, res) {
    if (req.isAuthenticated()) {
        data.find()
            .exec(function (err, list_items) {
                if (err) {
                    console.log("don't find");
                    return next(err);
                }
                //Successful, so render
                console.log("Successful, so render");
                console.log(list_items);
                //res.render('danh_sach_tai_khoan', {title: '', list_items: list_items});
                //res.render('danh_sach_tai_khoan', {title: '', list_items: list_items, user: req.user});
            });

    } else {
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.render('dang_nhap', {
            errorText: ''
        });
    }
};

