const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// if(process.env.NODE_ENV !=="production"){
  require('dotenv').config({ path: path.join(__dirname, '../.env') })
//}
const multer = require('multer')
const{storage}=require('../cloudinary/upload.js')
const upload=multer({storage})

// connection
const { url, conn } = require('./conn');
const { stringify } = require('querystring');
conn.on('error', console.error.bind(console, 'MongoDB connection error:'));

//collections
const db_signup = conn.model("signup", new mongoose.Schema({
  username: { type: String, index: true, unique: true },
  password: String,
  fullname: String,
  recoverpassword: String
}))

const db_post = conn.model("post", new mongoose.Schema({
  title: String,
  desc: String,
  img: [{url:String,filename:String}]
  // img2: {url:String,filename:String},
  // img3: {url:String,filename:String},
  // img4: {url:String,filename:String},
  // img5: {url:String,filename:String}
}))

//port
const port = process.env.PORT || 4000;
//path
const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');
//set engine
const app = express();
app.set('view engine', 'ejs');
app.set('views', template_path);
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



app.get("/", (req, res) => {
  res.render('about')
})
app.get("login", (req, res) => {
  res.render("login")
})
app.get("signup", (req, res) => {
  res.render("signup")
})

app.get("/chef", async (req, res) => {
  let post_data = await db_post.find({})
  console.log(post_data[0].img[0].url)
  res.render("chef",{post_data:post_data})
})


app.post('/post_signup', async (req, res) => {
  let { username, fullname, password, recoverpassword } = req.body
  let check = await db_signup.findOne({ username: username }).then((data) => {
    if (!data) {
      new db_signup(req.body).save(err => {
        if (err) console.log("slow network 1")
        res.redirect("login")
      })
    }
    else res.send('<script>alert(" Username Already Exist ");location.href="signup"</script>')
  }).catch(err => {
    console.log("slow network 2")
  })
})
app.post("/post_login", (req, res) => {
  let { username, password } = req.body
  db_signup.findOne({ 'username': username, 'password': password }).then((data) => {
    if (data) {
      console.log("slow network 1")
      res.redirect("chef")
    }
    else res.send('<script>alert(" Username and Password Not Matched");location.href="login"</script>')
  }).catch(err => {
    console.log("slow network 2")
  })
})

app.get("/form", (req, res) => {
  res.render("form")
})
app.post("/post",upload.fields([{name:'img1'},{name:'img2'},{name:'img3'},{name:'img4'},{name:'img5'}]),(req,res)=>{
  let size=Object.keys(req.files).length
  let arr=[]
  for(let i=1;i<=size;i++){
    if(i==1) {
      arr.push({url:req.files.img1[0].path,filename:req.files.img1[0].filename})
    }
    else if(i==2) {
      arr.push({url:req.files.img2[0].path,filename:req.files.img2[0].filename})
    }
    else if(i==3) {
      arr.push({url:req.files.img3[0].path,filename:req.files.img3[0].filename})
    }
    else if(i==4) {
      arr.push({url:req.files.img4[0].path,filename:req.files.img4[0].filename})
    }
    else if(i==5) {
      arr.push({url:req.files.img5[0].path,filename:req.files.img5[0].filename})
    }
  }
  console.log(arr)  
  
  //res.send("heloooo")
 // const image=req.files.map(f=>({url:f.path,filename:f.filename}))
  new db_post({
    title: req.body.title,
    desc: req.body.desc,
    img: arr
  }).save(err =>{
    if(err) console.log('image error')
    else res.send("<script> alert('Post Succesfully');window.location.href='chef'</script>" )
  })  
})

app.get("/login", (req, res) => {
  res.render('login.ejs');
})
app.get("/signup", (req, res) => {
  res.render('signup.ejs');
})
app.get("/about", (req, res) => {
  res.render('about.ejs');
})
app.get("/aboutus", (req, res) => {
  res.render('aboutus.ejs');
})

app.get("*", (req, res) => {
  res.status(404).send('Sorry, we cannot find that!')
})

app.listen(port, () => {
  console.log('listening to port' + port)
})
