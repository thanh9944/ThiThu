const express = require('express');
const {body, validationResult} = require('express-validator')
const router = express.Router();
const mongoose = require('mongoose');
const db = 'mongodb+srv://nhatthanh:tH1Q6cm2DALowCiK@cluster0.bjchc.mongodb.net/cars?retryWrites=true&w=majority';
const {Schema} = mongoose;
mongoose.connect(db).catch(err => {
    if (err) {
        console.log("có lỗi xảy ra:" + err)
    }
});

var sinhVien = new Schema({
    id: String,
    email: String,
    address: String,
    key: Number,
    date: Date
})

var Students = mongoose.model('students', sinhVien)

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/update', function (req, res, next) {
    res.render('update');
});

router.get('/show', async function (req, res, next) {
    const sv = await Students.find({});
    res.render('show', {data: sv});
});

router.post('/add',
    body('id', 'ko de trong id').notEmpty(),
    body('address', 'ko de trong address').notEmpty(),
    body('email', 'ko de trong email').notEmpty(),
    body('email', 'email phai hop le').isEmail(),
    body('key', 'ko de trong key ').notEmpty(),
    body('key', 'key <2 >7').isLength({min:2,max:7}),
    body('date', 'ko de trong date va date phai la dd/mm/yyyy').notEmpty()
    , async function (req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const alert = errors.array()
            res.render('index', {
                alert,
                id: req.body.id,
                email: req.body.email,
                address: req.body.address,
                key: req.body.key,
                date: req.body.date
            })
        } else {
            const {id, email, address, key, date} = req.body
            const newSV = new Students({
                id: id,
                email: email,
                address: address,
                key: key,
                date: date
            })

            await newSV.save(function (err) {
                res.redirect('/show')
            })
        }

    });

router.post('/delete', async function (req, res, next) {
    var id = req.body._id
    await Students.deleteOne({_id: id})
    res.redirect('/show')
});

router.post('/update', async function (req, res, next) {
    const {_id, id, email, address, key, date} = req.body

    res.render('update', {_id: _id, id: id, email: email, address: address, key: key, date: date})

});
router.post('/update-sv', function (req, res, next) {
    const {_id, id, email, address, key, date} = req.body

    Students.updateOne({_id: _id}, {
        id: id,
        email: email,
        address: address,
        key: key,
        date: date
    }, function (err) {
        res.redirect('/show')
    })

});

router.post('/find', async function (req, res, next) {
    const id = req.body.ids
    const sv = await Students.find({id: id})
    res.render('show', {data: sv});
});

module.exports = router;
