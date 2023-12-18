// if(process.env.NODE_ENV !== 'production') {
//     require('dotenv').parse()
// }
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const uri = 'mongodb+srv://praveenpj000:pavan6747@cluster0.vfxowr4.mongodb.net/pavan?retryWrites=true&w=majority'


const indexRouter = require('./routes/index');
app.set('view engine','ejs');
app.set('views',__dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
const mongoose = require('mongoose');
app.use(express.json());
mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db =mongoose.connection
db.on('error', error => console.error(error));
db.once('open',() => console.log('connected to Mongoose'));

app.use('/',indexRouter);

app.listen(process.env.PORT || 3000);