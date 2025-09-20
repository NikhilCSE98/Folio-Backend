const { configDotenv } = require('dotenv');
const express=require('express');
const app= express();
app.use(express.json());

require('dotenv').config();
const port=process.env.PORT;
const user=require('./routes/user')
const Books=require('./routes/book')
const favourite=require('./routes/favourite')
const cart=require('./routes/cart')
const order=require('./routes/order')
const cors=require('cors')
require('./db/db')

app.use(cors())
app.use("/api/v1",user);
app.use("/api/v1",Books);
app.use("/api/v1",favourite);
app.use("/api/v1",cart);
app.use("/api/v1",order);

app.get('/',(req,res)=>{
    res.send("hi")
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
