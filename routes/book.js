const router=require('express').Router();
const mongoose=require('mongoose')
const User =require('../models/user')
const jwt =require('jsonwebtoken')
const Book=require('../models/book')
const {authToken}=require('./userAuth')

router.post('/add-book',authToken,async (req,res) => {
    try {
        const {id}=req.headers;
        const user=await User.findById(id);

        if(user.role!=='admin'){
            return res
            .status(400)
            .json({message:"You are not having access to perform admin work"})
        }

        const book=new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
            stock:req.body.stock,
            isbn:req.body.isbn,
            genre:req.body.genre
        });
        await book.save();
        res.status(200).json({message:"Book adds successfully"})
    } catch (error) {
        res.status(500).json({message:"An error occured"})
    }    
});

router.put('/update-book',authToken,async (req,res) => {
    try {
        const {bookid}=req.headers;
        await Book.findByIdAndUpdate(bookid,{url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
            stock:req.body.stock,
            isbn:req.body.isbn,
            genre:req.body.genre,
        });

        return res.status(200).json({message:"Book updated successfully"})
    } catch (error) {
        res.status(500).json({message:"An error occured"})
    }    
})

router.delete('/delete-book',authToken,async (req,res) => {
    try {
        const {bookid}=req.headers;
        await Book.findByIdAndDelete(bookid);

        return res.status(200).json({message:"Book deleted successfully"})
    } catch (error) {
        res.status(500).json({message:"An error occured"})
    }    
})

router.get('/get-all-books',async (req,res) => {
    try {
        const books=await Book.find().sort({createdAt:-1})

        return res.json({status:"success", data:books})
    } catch (error) {
        res.status(500).json({message:"An error occured"})
    }    
})

router.get('/get-recent-books',async (req,res) => {
    try {
        const books=await Book.find().sort({createdAt:-1}).limit(4);

        return res.json({status:"success", data:books})
    } catch (error) {
        res.status(500).json({message:"An error occured"})
    }    
})

router.get('/get-book-by-id/:id',async (req,res) => {
    try {
        const {id}=req.params;
        const book=await Book.findById(id);

        return res.json({status:"success", data:book})
    } catch (error) {
        res.status(500).json({message:"An error occured"})
    }    
})
router.get("/search-book", async (req, res) => {
  try {
    const query = req.query.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } }
      ]
    }).limit(10);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});


router.post('/filter-books', async (req, res) => {
  try {
    const { genres } = req.body;

    if (!genres || genres.length === 0) {
      return res.status(400).json({ message: "No genres provided" });
    }

    const books = await Book.aggregate([
      { $match: { genre: { $in: genres } } },
      { $sample: { size: 20 } },
    ]);

    return res.json({ status: "success", data: books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});


router.post('/add-review/:bookid', authToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { comment, rating } = req.body;
    const { id } = req.headers; 

    const book = await Book.findById(bookid);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.reviews.push({ user: id, comment, rating });

    const total = book.reviews.reduce((acc, r) => acc + r.rating, 0);
    book.averageRating = total / book.reviews.length;

    await book.save();
    res.status(200).json({ message: "Review added", data: book });
  } catch (error) {
    res.status(500).json({ message: "Error adding review" });
  }
});


router.get('/get-reviews/:bookid', async (req, res) => {
  try {
    const { bookid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookid)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }
    const book = await Book.findById(bookid)
      .populate('reviews.user', 'username email avatar'); 

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    

    res.json({
      status: "success",
      user:book.user,
      reviews: book.reviews,
      averageRating: book.averageRating,
    });
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});
module.exports=router;