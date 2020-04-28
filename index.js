const express = require('express');
const mysql = require('mysql');

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

const app = express();

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
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql,(err, result)=>{
        if(err) {
            console.log(err);
        }
        console.log(result);
        res.send('posts table created...');
    });
});

// insert post 1
app.get('/addpost',(req,res)=>{
    let post = {title:'data', body: 'ini pertama'};
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result)=>{
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
        console.log(results);
        res.json();
        // res.send('get the posts');
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