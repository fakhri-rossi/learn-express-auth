const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://127.0.0.1/auth_demo')
    .then((result) => {
        console.log('<< connected to mongodb >>');
        
    }).catch((err) => {
        console.log('<< failed to connect mongodb >>');

    });

app.set('view engine', 'ejs');
app.set('views', 'views');

// middleware to gather data from req.body
app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

const User = require('./models/user');


app.use((req, res, next) => {
    res.locals.flashMessage = req.flash('flashMessage');
    next();
});

app.get('/', (req, res) => {
    res.render('homepage');
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

    req.flash('flashMessage', 'Berhasil Register!');
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if(user){
        const isMatch = await bcrypt.compareSync(password, user.password);

        if(isMatch){
            req.session.user_id = user._id;
            req.flash('flashMessage', 'Login Berhasil!');
            res.redirect('/admin');

        } else {
            req.flash('flashMessage', 'Password salah!');
            res.redirect('/login');
        }

    } else {
        req.flash('flashMessage', 'User tidak ditemukan!');
        res.redirect('/login');
    }
});


app.get('/admin', (req, res) => {
    if(!req.session.user_id){
        res.redirect('/login');
    } else {
        res.send('Halaman ini hanya bisa diakses jika kamu login');
    }
});



app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});