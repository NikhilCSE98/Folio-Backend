const mongoose=require('mongoose');
require('dotenv').config();
const db=async()=>{
    try{
        await mongoose.connect(process.env.URL);
        console.log("Database connected")
    }
    catch(error){
        console.log("connection error")
    }
}
db();
