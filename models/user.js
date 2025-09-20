const mongoose=require('mongoose');
const user=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://cdn4.iconfinder.com/data/icons/travello-basic-ui-1/64/Profile-256.png"
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    favourites:[{
        type:mongoose.Types.ObjectId,
        ref:"book"
    }],
    cart: [
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "book" },
    quantity: { type: Number, default: 1 },
  }
],
    orders:[{
        type:mongoose.Types.ObjectId,
        ref:"order"
    }]

},
{timestamps:true}
);
module.exports=mongoose.model('user',user)