const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
var Jimp = require('jimp');


const AddReceipt = require('./modals/receipt')

const fileStorage = multer.diskStorage({
    destination: (req, res,cb) =>{
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
})

const fileFilter = (req, file, cb ) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
       cb(null, true); 
    }else{
        cb(null, false);
    }
}


app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).array('image'));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'template')));



app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cors());


app.post('/generate', (req,res,next) =>{
    const receipt = new AddReceipt( req.body, req.files);
    receipt.save();
    res.redirect('/receipt')
})

app.get('/receipt', (req, res, next) =>{
    const image =  path.join(
        path.dirname(process.mainModule.filename), 
        'data',
        'a.jpeg'
        );
    AddReceipt.fetchAll(receipt =>{
        Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => {
            // load font from .fnt file
            image.print(font, 0, 0, 'hello world'); // print a message on an image. message can be a any type
            image.print(font, x, y, message, maxWidth); // print a message on an image with text wrapped at maxWidth
        });
    })
    res.redirect('/');
})

app.use('/', (req,res,next) =>{
    res.render('generate');
    
});





app.listen(process.env.PORT || 4000);