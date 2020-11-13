//Packages to include.
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const cors = require('cors');


//Use a .env file to save the URI for the mongoDB account.
require('dotenv').config();
mongoose.connect('mongodb+srv://user123:user123@cluster0.5bdkd.mongodb.net/tidderland?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true});
// Use a .env file to save the port number for the server, with default alternative.

mongoose.set('useCreateIndex', true)
const port = process.env.PORT || 5000;

//Attempt to connect to the DB.
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(cors());
app.use(express.json());

//Set the routes for the login page.
const userRouter = require('./routes/users');
app.use('/users', userRouter);

const postRouter = require('./routes/posts');
app.use('/posts', postRouter);

const subRouter = require('./routes/sub');
app.use('/sub', subRouter);
//Try to run the server on the given port.
app.listen(port, () => console.log('Server started on port: ' + port));
