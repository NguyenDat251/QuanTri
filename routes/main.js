var express = require('express');
var router = express.Router();
var mainController = require('../controllers/main_controller');
/* GET home page. */

router.get('/', mainController.index);


//router.post('/main_sign_in', danh_sach_tai_khoan_admin_controller.sign_in);

router.get('/dang_ky', function(req, res, next) {
    res.render('dang_ky', { title: '' });
});

module.exports = router;
