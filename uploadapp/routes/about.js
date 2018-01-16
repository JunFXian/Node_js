var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.send('About: this is a project to upload recipes');
});

module.exports = router;
