const mongoose=require('mongoose')

const order=new mongoose.Schema({
    user:
    {
        type:mongoose.Types.ObjectId,
        ref:"user",
    },
    book:{
        type:mongoose.Types.ObjectId,
        ref:"book"
    },
    status:{
      type:String,
      default:"Order placed",
      enum:["Order placed","Out of delivery","Delivered","Canceled"]
    }
},{timestamps:true}
)
module.exports=mongoose.model('order',order)