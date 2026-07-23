const Listing  = require("../models/listing.js");
const Review = require("../models/review.js");

//for post review route 

module.exports.postReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    
    let newReview =  new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created Successfully!");
    res.redirect(`/listings/${listing._id}`);
};

// for delete review route 

module.exports.destroyReview = async(req, res)=>{
        let {id , reviewId} = req.params;
        await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}}); // here pull delete the object id of review from the array too and update it
        await Review.findByIdAndDelete(reviewId);
        req.flash("success" , "Review Deleted Successfully!");
        res.redirect(`/listings/${id}`);
};