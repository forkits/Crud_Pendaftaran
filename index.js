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
            }
            console.log(req.body);
            // res.end();
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
        // let id_siswa;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nomor Anda</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        </head>
        <body>
            <header>
                <nav class="navbar navbar-light bg-primary">
                    <div class="container">
                        <div class="d-flex">
                          <div class="navbar-nav">
                            <a class="nav-item nav-link active text-light" href="/">Ambil Nomor <span class="sr-only">(current)</span></a>
                            <a class="nav-item nav-link text-light" href="/search">Cari Nomor</a>
                          </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div class="container text-center">
                <h3>Selamat datang di Pengambilan Nomor <br> SMKN 1 NGLEGOK</h3>
                
            </div>
            <div class="container">
                <div id="nomor-id">
                    
                </div>
            </div>

            <script type='text/javascript'>
                const hasil = document.getElementById("nomor-id");
                fetch('http://localhost:3000/nomor/${req.params.no_nisn}')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    data_siswa = data.map((id_siswa)=>{
                        return \`
                                <div>ppdb2020-\${id_siswa.id}</div>
                                <div>nama : \${id_siswa.nama_peserta}</div>
                                <div>asal : \${id_siswa.nama_sekolah}</div>
                                <div>nomor hp : \${id_siswa.no_hp}</div>
                                <div>nomor NISN : \${id_siswa.no_nisn}</div>
                            \`
                        \}
                    ).join("");
                    hasil.insertAdjacentHTML("afterbegin", data_siswa);
                })
                .catch(err => {
                    console.log(err);
                })
            </script>

            <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
        </body>
        </html>`);
        res.json();
        res.end();
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