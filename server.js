const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const express = require('express');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");

// mongodb connection
mongoose.connect("mongodb://0.0.0.0:27017/db1");

//Modules
const User = mongoose.model("User", new mongoose.Schema({
    email : String,
    password : String,
    name : String
}), "user");

const Category = mongoose.model("Category" , new mongoose.Schema({
    name : String
}));

const Product = mongoose.model("Product", new mongoose.Schema({
    name : String,
    price : Number,
    photo : String,
    category :String
}));


// Multer (photo upload)
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb)=> cb(null,"./uploads/"),
        filename:(req,file,cb)=> cb(null, Date.now() + path.extname(file.originalname))
    })
});

// Api Section

//Register (php se call hoga)
app.post("/api/register", async (req, res) => {
    console.log(req.body);

    await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    res.json({ success: true });
});

//login (php se call hoga)
app.post("/api/login", async (req, res) => {
    let u = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (!u) return res.json({ success: false });

    res.json({ success: true });
});


//Add Product
app.post("/add-product", upload.single("photo"), async (req,res)=>{
    await Product.create({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        photo: req.file.filename
        
    });
    res.redirect("/");
});

//Delete product
app.get("/delete/:id", async (req,res)=>{
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

// Home page
app.get("/", async (req,res)=>{
    const products = await Product.find();
    res.render("index", {products});
});


//Form Page
app.get("/add", (req,res)=>{
    res.render("add");
});

//Start server
app.listen(3000, ()=>{
    console.log("server is running.......")
});