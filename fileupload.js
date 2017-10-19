var multer = require('multer');
var md5 = require('md5');
var config = require('./config');
var storage = multer.diskStorage({
    destination: config.upload.path,
    filename: function (req, res, cb) {
        var fileformat = (file.originalname).split('.');
        cb(null, file.fieldname + '-' + md5(file) + "." + fileformat[fileformat.length - 1]);
    }
});
var upload = multer({
    storage: storage
});
module.exports = upload;