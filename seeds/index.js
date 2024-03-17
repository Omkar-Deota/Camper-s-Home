const mongoose=require('mongoose');
const cities=require('./cities')
const { places, descriptors } = require('./seedHelpers');

const Campground = require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const rand1000=Math.floor(Math.random()*1000);
        const p=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            location:`${cities[rand1000].city},${cities[rand1000].state}`,
            title:`${sample(descriptors)}  ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit consectetur quam hic maxime sint ratione incidunt adipisci recusandae autem ducimus. Et mollitia illum quam. Saepe error ea odit quam ab?Voluptatum placeat tenetur nesciunt nobis rerum iusto reprehenderit ut, inventore neque, nulla vero nostrum blanditiis? Nesciunt temporibus eligendi iste. Maxime, possimus tempora. Possimus repellendus deleniti commodi aut voluptas cumque iste?",
            price:p
        })
        await camp.save();
    }
    
}
seedDB();