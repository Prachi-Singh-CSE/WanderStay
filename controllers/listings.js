const Listing  = require("../models/listing.js");
const mbxGeocoding =  require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken : mapToken});


// for index route 

module.exports.index = async (req ,res)=>{
    const allListings =  await Listing.find({});
   res.render("listings/index.ejs", {allListings});
    
};

// for new route

module.exports.renderNewForm =  (req , res)=>{
    res.render("listings/new.ejs");
};


// for create route

module.exports.createListing = async(req,res,next) =>{
 let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
  
   let url = req.file.path;
   let filename = req.file.filename;
  
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;
//    newListing.image =  {url , filename}
   newListing.image = { url: req.file.path, filename: req.file.filename };
   console.log(newListing);

   newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
   req.flash("success" , "New Listing Created Successfully!");
   res.redirect("/listings");
};

// for show route 

module.exports.showListing = async (req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({ 
        path : "reviews",
          populate :{
            path: "author",
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs" ,{listing});
};

// for edit route

 module.exports.editListing = async(req ,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    
    }
     let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
};

// for update route

module.exports.updateListing =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});// javascript object used to acquire all the values 
    
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url: req.file.path, filename: req.file.filename };
        console.log(listing)
        await listing.save();
    }
    req.flash("success" , " Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

// for destroy route

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , " Listing Deleted Successfully!");
    res.redirect("/listings");
};






