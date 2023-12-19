require('dotenv').config();

if(process.env.DATABASE_URL!== 'production') {
    require('dotenv').parse()
 }
const express = require('express');

const app = express();
const expressLayouts = require('express-ejs-layouts');


const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bodyParser = require('body-parser');
app.set('view engine','ejs');
app.set('views',__dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
const mongoose = require('mongoose');
app.use(express.json());
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db =mongoose.connection
db.on('error', error => console.error(error));
db.once('open',() => console.log('connected to Mongoose'));

app.use('/',indexRouter);
app.use('/authors',authorRouter);

app.listen(process.env.PORT || 3000);