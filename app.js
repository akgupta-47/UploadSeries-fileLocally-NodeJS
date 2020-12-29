const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const ejs = require('ejs');
const path = require('path');

// set storage engine
// html code requirements = form action="/upload" method="POST" enctype="multipart/form-data"

const storage = multer.memoryStorage();

// Init upload variable, .single- specify to allow only single image upload
const upload = multer({
    storage,
    limits: {fileSize: 1000000},
    fileFilter: (req,file,cb) => {
        checkFileType(file, cb);
    } 
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

// Resize image to particular needs
const ImageResizer = async (req,res, next) => {
    if (!req.file) return;
    // console.log(typeof req.next);

    req.file.filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
  
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFile(`./public/uploads/${req.file.filename}`, 
        (err) => {
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
        });
}

// Init app variable
const app = express();

app.get('/', (req, res) => res.render('index'));

app.post('/upload',upload, ImageResizer);

// EJS
app.set('view engine', 'ejs');
//Public folder
app.use(express.static('./public'));

const port = 3000 || PROCESS.env.PORT;

app.listen(port, () => console.log(`Server listening on port ${port}`));
