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



app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

mongoose
.connect("mongodb://localhost:27017/userdbdemo")
.then(()=>{console.log("connection done")})
.catch(err=>console.log("err"));

const studentschema= mongoose.Schema({
    username:String,
    email:String,
    password:String,
    photo:String
});

const student=mongoose.model("student",studentschema);

//multer
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"_"+file.originalname);
    },
});

const uploads=multer({storage});

app.get("/reg",(req,res)=>{
    res.render("reg");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

//reg
app.post("/register",uploads.single("photo"), (req,res)=>{

    const userdata=new student({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        photo:req.file? req.file.filename:""
    });
    userdata.save();
    res.render("login");
});

app.post("/login",async (req,res)=>{

    const {email,password}=req.body;
    if(!email|| !password)return res.send("provide email or password");

    const s = await student.findOne({
        email:req.body.email,
        password:req.body.password
    });
    if (!s) return res.json("invalid");

    res.render("dashboard");
});


//show data
app.get("/showdata",async (req,res)=>{
    const datais= await student.find();
    res.render("showdata" ,{data:datais});
});

//edit data
app.get("/edit/:id" ,async (req,res)=>{
    const editdata= await student.findById(req.params.id);
    res.render("edit",{data:editdata});
});

// Edit data according to the form 
app.post("/editdata/:id",async (req,res)=>{
   await student.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        subject: req.body.subject,
        marks: req.body.marks
    });
    res.redirect("/showdata");
});
//delete
app.get("/delete/:id",async (req,res)=>{
    await student.findByIdAndDelete(req.params.id);
    res.redirect("/show")
});


//Start server
app.listen(3000, ()=>{
    console.log("server is running.......")
});
