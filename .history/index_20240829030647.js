const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const { log } = require("console");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError");
const chat = require("./models/chat.js");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

// ----------Index route--------------------------------
app.get("/chats", asyncWrap (req, res) => {
    let chats = await Chat.find();
    console.log(chats);
    res.render("index", { chats });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  
});
// ----------------------------------
// New chat form route--------------------------------
app.get("/chats/new", (req, res) => {
  // throw new ExpressError(202,"page not found");
  res.render("new.ejs");
});

// Create route
app.post("/chats", async (req, res,next) => {
 try{
 let { from, to, message } = req.body;
  
  let newChat = new Chat({
    from: from,
    to: to,
    message: message,
    created_at: new Date(),
  });
  await newChat.save();
  res.redirect("/chats");

 }catch(err){
  next(err);
 }
   
});function asyncWrap(fn) {
  return function(req,res,next){
  fn(req,res,next).catch(err);
  }
};
function asyncWrap(fn) {
  return function(req,res,next){
  fn(req,res,next).catch(err);
  }
};
//----show routes---this is for middleware---------
app.get("/chats/:id",async(req,res,next)=>{
  try{
 let {id}=req.params;
  let Chat=await Chat.findById(id);
  if(!Chat){
      next(new ExpressError(202,"chat not found"));

  }
    res.render("edit.ejs",{Chat});

  }catch(err){
    next(err);
  }
 
})

app.use((err,req,res,next)=>{
  let{status=500,message="some error"}=err;
  res.status(status).send(message);
  // next();
})


// ----------------------------------------------
// Edit route-----------------------------------
app.get("/chats/:id/edit", async (req, res) => {
  try{
 let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit", { chat });
  }catch(err){
    next(err);
  }
});

// update route
app.put("/chats/:id",async (req,res)=>{
  try{
     let {id}=req.params;
  let {message:newmsg}=req.body;
  let updatechat= await Chat.findByIdAndUpdate(id,
    {message:newmsg},
    {runValidators:true,new:true},
  );
  console.log(updatechat);
  res.redirect("/chats");
  }catch(err){
    next(err);
  }
 
});
// -----------------delete---------------------------------
app.delete("/chats/:id",async (req,res)=>{
  let {id}=req.params;
 let chatdelete=await Chat.findByIdAndDelete(id,    
    {runValidators:true,new:true},
  );
  console.log(chatdelete);
  res.redirect("/chats");
  

});



// Root route
app.get("/", (req, res) => {
  res.send("working");
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
