var express = require('express');
var router = express.Router();

var danh_sach_tai_khoan_admin_controller = require('../controllers/danh_sach_tai_khoan_admin_controller');
/* GET home page. */

router.get('/', function (req, res, next) {

    if (req.user) {
        console.log(req.user);
        res.redirect('/main');
    } else {
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.render('dang_nhap', {
            errorText: ''
        });
    }

});

router.post('/confirmation', danh_sach_tai_khoan_admin_controller.confirmationPost);
//router.post('/resend', danh_sach_tai_khoan_admin_controller.resendTokenPost);

router.post('/main_sign_in', danh_sach_tai_khoan_admin_controller.sign_in);

router.get('/dang_ky', function(req, res, next) {
    console.log("form đăng ký = get");
    res.render('dang_ky', { title: '' });
});
router.get('/log_out', function (req, res) {
    req.logOut();
    res.status(200).clearCookie('connect.sid', {
        path: '/'
    });
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});
router.post('/thay_doi_thong_tin_admin/', danh_sach_tai_khoan_admin_controller.update_post);
router.get('/thay_doi_thong_tin_admin/', danh_sach_tai_khoan_admin_controller.show_info);
router.get('/thong_tin_admin/', danh_sach_tai_khoan_admin_controller.detail);
// router.get('/thay_doi_thong_tin', function (req, res, next) {
//     console.log("form thay_doi_thong_tin_admin = get");
//     res.render('thay_doi_thong_tin', {title:''});
// });

router.get('/thong_ke_doanh_so', function(req, res, next) {
  res.render('thong_ke_doanh_so', { title: 'Express' });
});


router.get('/dang_xuat', function(req, res){
    req.logout();
    res.redirect('/');
})

module.exports = router;
