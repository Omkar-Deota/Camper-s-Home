const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session=require('express-session')
const campgrounds = require('./routes/campgrounds')
const review = require('./routes/review')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected")
});
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.get('/', (req, res) => {
    res.render('home');
})


app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', review);
app.use(express.static(path.join(__dirname,'public')));
const sessionConfig={
    secret:"Givemeasecret",
    resave:false,
    saveUnitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
}
app.use(session(sessionConfig));

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})
app.use((req, res) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
})
app.use((err, req, res, next) => {
    res.send("Oops!! something went wrong")
})
app.listen(3000, () => { console.log("Server is running on port 3000") })