const express = require('express');
const mysql = require('mysql');

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({
  extended: true
}));

// create connetion
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : '',
    database : 'data_siswa'
})

// connect
db.connect((err) => {
    if(err){
        console.log(err);
    }
    console.log('mysql connected ...');
})

// home
app.get('/', (req,res) => {
    res.render('index.html')
});

// create db
app.get('/createdb', (req, res) =>{
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err,result) => {
        if(err) {
           console.log(err);
        }
        console.log(result);
        res.send('database created ... ');
    });
});

// create table
app.get('/createpoststable', (req,res)=>{
    let sql = 'CREATE TABLE posts(id int(4) zerofill not null AUTO_INCREMENT, nama_peserta VARCHAR(255), no_hp VARCHAR(255), nama_sekolah VARCHAR(255), no_peserta VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql,(err, result)=>{
        if(err) {
            console.log(err);
        }
        console.log(result);
        res.send('Peserta table created...');
    });
});

// insert post 1

const users = []
app.post('/addpost',(req,res)=>{
    users.push({
        nama_peserta: req.body.name,
        no_hp: req.body.no_hp,
        nama_sekolah: req.body.name_sch
    })
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, users, (err, result)=>{
        if(err) {
            console.log(err);
        }
        console.log(result);
        res.send("post berhasil")
    });
});

// Select Posts
app.get('/getposts',(req,res)=>{
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results)=>{
        if(err) {
            console.log(err);
        }
        // console.log(results);
        res.json(results);

        // results.forEach((row) => {
        //     console.log(`${row.id} dengan nama ${row.nama_peserta}`);
            // res.send(`${row.id}`);
        // });
    });
});

// Select a Post
app.get('/getpost/:id',(req,res)=>{
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result)=>{
        if(err) {
            console.log(err);
        }
        console.log(result);
        res.send('posts fetch');
    });
});

// Update Post
app.get('/updatepost/:id',(req,res)=>{
    let newTitle = 'Update Title'
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result)=>{
        if(err) {
            console.log(err);
        }
        console.log(result);
        res.send('posts Updated');
    });
});

// delete Post
app.get('/deletepost/:id',(req,res)=>{
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result)=>{
        if(err) {
            console.log(err);
        }
        console.log(result);
        res.send('posts deleted');
    });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});