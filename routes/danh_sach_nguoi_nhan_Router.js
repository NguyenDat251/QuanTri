
var express = require('express');
var router = express.Router();
var danh_sach_nguoi_nhan_controller = require('../controllers/danh_sach_nguoi_nhan_controller');

router.get('/', danh_sach_nguoi_nhan_controller.index);
module.exports = router;