const mongoose=require('mongoose');
const { campgroundSchema } = require('../schema');
const Schema=mongoose.Schema;
// const Review=require('./review')
const CampgroundSchema=new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review',
            // reference to the Review model
        }
    ]
});


module.exports=mongoose.model('Campground',CampgroundSchema);
