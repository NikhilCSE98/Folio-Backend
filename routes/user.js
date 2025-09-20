const router=require('express').Router();
const User =require('../models/user')
const bcrypt=require("bcryptjs")
const jwt =require('jsonwebtoken')
const {authToken}=require('./userAuth')

router.post('/register',async (req,res) => {
    try {
        const {username,email,password,phone,address}=req.body;
        if(username.length<4)
        {
            return res 
            .status(400)
            .json({messsage:"username length should be greater than 3"})
        }
        const existingUser=await User.findOne({username:username});
        if(existingUser){
            return res.status(400).json({messsage:"username already exists"});
        }

        const existingEmail=await User.findOne({email:email});
        if(existingEmail){
            return res.status(400).json({messsage:"Email already exists"});
        }

        if(password.length<4)
        {
            return res 
            .status(400)
            .json({messsage:"Password length should be greater than 5"})
        }

        const hashpass=await bcrypt.hash(password,10);

        const newUser=new User({
            username:username,
            email:email,
            password:hashpass,
            phone:phone,
            address:address,
        });
        await newUser.save();
        return res.status(200).json({messsage:"Registered Successfully"})

    } catch (error) {
        console.log(error)
    }
    
})

router.post('/login',async (req,res) => {
    try {
        const{username,password}=req.body;
        const existingUser=await User.findOne({username});
        if(!existingUser){
            return res.status(400).json({messsage:"Invalid Credentials"});
        }
        await bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data){
                const authUser=[{name:existingUser.username},{role:existingUser.role}]
                const token=jwt.sign({authUser},"Secret_Key_of_Book_Management",{expiresIn:"5h"})
                return res.status(200).json({id:existingUser.id,role:existingUser.role,token:token});
            }
            else{
                return res.status(500).json({messsage:"Invalid Credentials"});
            }
        })
        
    } catch (error) {
        
    }
})

router.get('/get-user-info',authToken,async(req,res)=>{
    try {
        const{id}=req.headers;
        const data=await User.findById(id).select('-password');
        res.status(200).json(data);
        
    } catch (error) {
        return res.status(500).json({messsage:"Invalid Credentials"});
    }
})

router.put('/update-address',authToken,async(req,res)=>{
    try {
        const{id}=req.headers;
        const {address}=req.body;
        const data= await User.findByIdAndUpdate(id,{address:address})
        res.status(200).json("Address updated successfully");
    } catch (error) {
        return res.status(500).json({messsage:"Invalid Credentials"});
    }
})

module.exports=router;