const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, callback){
        // callback has 2 arguments error and filename
        // we can decide the format here, fieldname: the one used in html code for field
        // extname: gives the file extension
        // original name is the property of original name used by the file when Uploaded
        // `${file.fieldname}-${Date.now()}{path.extname(file.originalname)}`
        // file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
})
// html code requirements = form action="/upload" method="POST" enctype="multipart/form-data"

// Init upload variable, .single- specify to allow only single image upload
const upload = multer({
    storage,
    limits: {fileSize: 1000000},
    /* fileFilter: (req,file,cb) => {
        checkFileType(file, cb);
    } */
}).single('myImage');

// check file type
const checkFileType = (file, cb) => {
    // Allowed extension
    const fileTypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // check mimetypes
    const mimetype = fileTypes.test(file.mimetype);

    if(mimetype && extname) {
        return cb(null, true);
    }else {
        cb('Error: Images only');
    }
}

// Init app variable
const app = express();

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    // res.send('test');
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            })
        }else{
            // console.log(req.file);
            // res.send('test');
            if(req.file == undefined) {
                res.render('index', {
                    msg: 'Error: File not submitted!!'
                });
            }else{
                res.render('index', {
                    msg: 'File Uploaded!!',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

// EJS
app.set('view engine', 'ejs');
//Public folder
app.use(express.static('./public'));

const port = 3000 || PROCESS.env.PORT;

app.listen(port, () => console.log(`Server listening on port ${port}`));
