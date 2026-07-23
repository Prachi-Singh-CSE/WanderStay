const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
       filename :  {
           type : String, 
            default : "listingimage",
        },
        url:{
        type : String,
        default : "https://i.pinimg.com/736x/c0/3c/5d/c03c5d112b2f15a764f2c466cae70136.jpg",
        },
    //    set : (v) => 
    //     v === "" 
    //    ? "https://i.pinimg.com/736x/c0/3c/5d/c03c5d112b2f15a764f2c466cae70136.jpg" 
    //    : v,

      
    
    },
    price : Number,
    location : String,
    country : String,
    reviews :[
        {
        type : Schema.Types.ObjectId,
        ref : "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref : "User",
  } ,
  
  geometry :{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
});

// mongoose middleware for deleting the reviews when listing is deleted
listingSchema.post("findOneAndDelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;