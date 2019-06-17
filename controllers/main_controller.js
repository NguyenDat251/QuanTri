var mainModel = require('../models/main');

exports.index = function (req, res) {

	if (req.isAuthenticated()) {
		res.render('main', {user: req.user});
	} else {
		console.log(req.user);
		console.log(req.isAuthenticated());
		res.render('dang_nhap', {
			errorText: ''
		});
	}
};