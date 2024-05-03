const multer = require('multer');
const path = require('path');

// Setup Multer storage options
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function (req, file, callback) {
        // callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        callback(null, file.originalname );
    }
});

const upload = multer({ storage: storage });


module.exports = upload;