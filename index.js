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

// middleware ngecek auth sebelum masuk ke page tertentu
const auth = (req, res, next) => {
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    next();
};


app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    req.session.user_id = user._id;

    res.redirect('/admin');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findByCredentials(username, password);

    if(user){
        req.session.user_id = user._id;
        res.redirect('/admin');

    } else {
        res.redirect('/login');
    }
});

app.post('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.get('/admin', auth, (req, res) => {
    res.render('admin');
});


app.get('/admin/settings', auth, (req, res) => {
    res.send(`Profile Settings: ${req.session.user_id}`);
});

app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});