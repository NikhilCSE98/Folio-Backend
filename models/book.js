const mongoose = require('mongoose')
const reviewSchema=require('./reviewSchema')

const book = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    desc: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 1   
    },
    isbn: {
        type: String,
        required: true,
        unique: true,  
        match: [/^(97(8|9))?\d{9}(\d|X)$/, "Please enter a valid ISBN (10 or 13 digits)"]
    },
    genre: {
        type: String,
        required: true
    },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 }

}, { timestamps: true });
module.exports = mongoose.model('book', book);