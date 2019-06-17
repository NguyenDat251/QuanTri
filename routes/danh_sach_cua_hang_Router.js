var express = require('express');
var router = express.Router();
var danh_sach_cua_hang_controller = require('../controllers/danh_sach_cua_hang_controller');
/* GET home page. */

router.get('/', danh_sach_cua_hang_controller.index);


//router.post('/main_sign_in', danh_sach_tai_khoan_admin_controller.sign_in);
router.post('/thay_doi_thong_tin_cua_hang/:id', danh_sach_cua_hang_controller.update_post);
router.get('/thay_doi_thong_tin_cua_hang/:id', danh_sach_cua_hang_controller.show_info);
router.get('/xoa_cua_hang/:id', danh_sach_cua_hang_controller.delete_post);
router.post('/them_cua_hang', danh_sach_cua_hang_controller.add);
router.get('/them_cua_hang', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('them_cua_hang', { title: 'Express', user: req.user });
    } else {
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.render('dang_nhap', {
            errorText: ''
        });
    }

});




module.exports = router;
