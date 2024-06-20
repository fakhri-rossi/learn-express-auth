const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1/auth_demo');

app.set('view engine', 'ejs');
app.set('views', 'views');

// middleware to gather data from req.body
app.use(express.urlencoded({
    extended: true
}));

const User = require('./models/user');

app.get('/', (req, res) => {
    res.send('homepage');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const user = new User({
        username,
        password: hashedPassword
    });

    await user.save();
    console.log(user);
    res.redirect('/');
});


app.get('/admin', (req, res) => {
    res.send('Halaman ini hanya bisa diakses jika kamu login');
});



app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});