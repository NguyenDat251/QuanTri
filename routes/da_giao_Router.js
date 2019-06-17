var express = require('express');
var router = express.Router();
var da_giao_controller = require('../controllers/da_giao_controller');

router.get('/', da_giao_controller.index);
module.exports = router;
