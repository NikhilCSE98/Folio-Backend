const router=require("express").Router();
const Book=require('../models/book')
const Order=require('../models/order')
const User=require('../models/user')
const {authToken}=require('./userAuth');

router.post('/place-order',authToken,async (req,res) => {
    try {
        const {id}=req.headers;
        const {order}=req.body;
        for(const orderData of order){
            const newOrder=new Order({user:id,book:orderData._id});
            const orderDataFromDB=await newOrder.save();

            await User.findByIdAndUpdate(id,{$push:{orders:orderDataFromDB._id},})
            await User.findByIdAndUpdate(id,{$pull:{cart:orderData._id},});
        }
            return res.json({
                status:"Success",
                message:"Order placed Scuccessfully"
            })
    } 
    catch (error) {
        return res.status(500).json({message:"An error occured"})
    }
})

router.get('/get-order-history',authToken,async(req,res)=>{
    try {
        const{id}=req.headers;
        if (!id) return res.status(400).json({ message: "User ID missing in headers" });
        const userData=await User.findById(id).populate({
            path:"orders",
            populate:{path:"book"},
        });
if (!userData) return res.status(404).json({ message: "User not found" });

    const orderData = (userData.orders || []).reverse();
       return res.json({
                status:"Success",
                data:orderData,
            })
        
    } catch (error) {
        return res.status(500).json({message: error.message || "Invalid Credentials"});

    }
})

router.get('/get-all-orders',authToken,async(req,res)=>{
    try {
        const userData=await Order.find()
        .populate({path:"book"})
        .populate({path:"user"})
        .sort({createdAt:-1})
       return res.json({
                status:"Success",
                data:userData,
            })
        
    } catch (error) {
        return res.status(500).json({messsage:"Invalid Credentials"});
    }
})

router.put('/update-status/:id',authToken,async (req,res) => {
    try {
        const {id}=req.params;
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({
            status:"Success",
            message:"Status Updated Successfully",
        })
    } 
    catch (error) {
        return res.status(500).json({message:"An error occured"})
    }
})

module.exports=router;