const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'psql',
        database: 'smart-brain'
    }
});

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    db.select().from('users').returning('*')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.status(400).json('unable to get users'));
});

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

const PORT_VAL = process.env.PORT || 3000
app.listen(PORT_VAL, () => {
    console.log(`app is running on port ${PORT_VAL}`);
});