var express = require('express');
var router = express.Router();
var giao_hang_controller = require('../controllers/giao_hang_controller');

router.get('/', giao_hang_controller.index);
module.exports = router;
