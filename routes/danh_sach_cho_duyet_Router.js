var express = require('express');
var router = express.Router();
var danh_sach_cho_duyet_controller = require('../controllers/danh_sach_cho_duyet_controller');
/* GET home page. */

router.get('/', danh_sach_cho_duyet_controller.index);
router.get('duyet/:id', danh_sach_cho_duyet_controller.add);

// router.get('/thay_doi_thong_tin_tai_khoan/:id', danh_sach_tai_khoan_controller.show_info);
 router.get('/xoa_tai_khoan/:id', danh_sach_cho_duyet_controller.delete_post);
// router.post('/thay_doi_thong_tin_tai_khoan/:id', danh_sach_tai_khoan_controller.update_post);
// router.post('/them_tai_khoan', danh_sach_tai_khoan_controller.add);
// router.get('/them_tai_khoan', function(req, res, next) {
//     if (req.isAuthenticated()) {
//         res.render('them_tai_khoan', { title: 'Express', user: req.user });
//     } else {
//         console.log(req.user);
//         console.log(req.isAuthenticated());
//         res.render('dang_nhap', {
//             errorText: ''
//         });
//     }
//
// });




module.exports = router;
