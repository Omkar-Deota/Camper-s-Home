const express = require('express')
const app = express()
const path = require('path')
const { campgroundSchema } = require('./schema')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const morgan = require('morgan')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
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
app.use(morgan('common'));
app.get('/', (req, res) => {
    res.render('home');
})
const validateCamp = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));
app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCamp, catchAsync(async (req, res) => {
    if (!req.body.campground) throw new ExpressError("Invalid data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)



}))
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campgrounds });
}));
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });

}))
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
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