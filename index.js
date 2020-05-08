const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { check, validationResult } = require('express-validator');
// const swal = require('sweetalert2');

const app = express();


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.urlencoded({
    extended: true
}));

const urlencodedParser = bodyParser.urlencoded({ extended: false })

// create connetion
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'data_siswa'
})

// connect
db.connect((err) => {
    if (err) {
        console.log(err);
    }
    console.log('mysql connected ...');
})

// home
app.get('/', (req, res) => {
    res.render('index.html')
});

// search nomor
app.get('/search', (req, res) => {
    res.render('search.html')
});

// Nomor NISN
app.get('/Nomor', (req, res) => {
    res.render('nomor.html')
});

// create db
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send('database created ... ');
    });
});

// create table
app.get('/createpoststable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int(4) zerofill not null AUTO_INCREMENT, nama_peserta VARCHAR(255), nama_sekolah VARCHAR(255), no_hp VARCHAR(255), no_nisn VARCHAR(255) UNIQUE, PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send('Posts table created...');
    });
});

// insert post 1

let users = [];
app.post('/addpost', urlencodedParser,(req, res) => {
    users = ({
        nama_peserta: req.body.name,
        nama_sekolah: req.body.name_sch,
        no_hp: req.body.no_hp,
        no_nisn: req.body.no_nisn
    });    
    let sql = 'INSERT INTO posts SET ?';
        let query = db.query(sql, users , (err, result) => {
            if (err) {
                console.log("No NISN sudah terdaftar");
                // req.send('No NISN sudah terdaftar')
            }
            console.log(req.body);
                res.redirect('/nomor');
            });
});

// Select Posts
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        res.json(results);
    });
});

// Select a Post by id
// app.get('/search/:id', (req, res) => {
//     let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.json(result);
//     });
// });

// Select a Post by nisn
app.get('/search/:no_nisn', (req, res) => {
    let sql = `SELECT * FROM posts WHERE no_nisn=${req.params.no_nisn}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result);
    });
});

// Select a Post by nisn
app.get('/nomor/:no_nisn', (req, res) => {
    let sql = `SELECT * FROM posts WHERE no_nisn=${req.params.no_nisn}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result);
    });
});


// Update Post
app.get('/updatepost/:id', (req, res) => {
    let newTitle = 'Update Title'
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send('posts Updated');
    });
});

// delete Post
app.get('/deletepost/:id', (req, res) => {
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send('posts deleted');
    });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});