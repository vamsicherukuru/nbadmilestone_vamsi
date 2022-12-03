const mongoose = require('mongoose')
const Schema = mongoose.Schema;



const productSchema = new Schema({
    // title: {type:String, required:[true, 'This is required buddy']},
    // price:Number
    author: {type: Schema.Types.ObjectId, ref:'User'},
    item_name:{type:String,required:[true,'Name is required buddy']},
    item_category:{type:String,required:[true,'item_category is required buddy']},
    manufacturer:{type:String,required:[true,'manufacturer is required buddy']},
    image:{type:String,required:[true,'image is required buddy']},
    status:{type:String,enum:['In Stock','Out of Stock','Discontinued'],required:[true,'status is required buddy']},
    details:{type:String,required:[true,'description is required'],minLength:[5]},
    price:{type:Number,required:[true,'price is required buddy']}

},
{timestamps:true}

);

module.exports = mongoose.model('trades',productSchema);

// const pro = new Product({
//     title:"Vamsi",
//     price:500
// });


// pro.validate()
// .then(rr=> console.log("Successfully inserted"))
// .catch(err=>console.log(err.message))

