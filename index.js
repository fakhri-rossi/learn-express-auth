const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

const User = require('./models/user');

app.get('/register', (req, res) => {
    res.render('register')
});

app.get('/admin', (req, res) => {
    res.send('Halaman ini hanya bisa diakses jika kamu login');
});



app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});