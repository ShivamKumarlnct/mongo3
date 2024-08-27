const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const { log } = require("console");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError");
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
app.get("/chats", async (req, res) => {
  try {
    let chats = await Chat.find();
    console.log(chats);
    res.render("index", { chats });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
// ----------------------------------
// New chat form route--------------------------------
app.get("/chats/new", (req, res) => {
  res.render("new");
});

// Create route
app.post("/chats", async (req, res) => {
  let { from, to, message } = req.body;
  
  let newChat = new Chat({
    from: from,
    to: to,
    message: message,
    created_at: new Date(),
  });

  
     newChat.save();
    console.log("Chat was saved");
    res.redirect("/chats");
 
});
// ---show routes------------
app.get("/chats/:id",async(req,res,next)=>{
  let {id}=req.params;
  let Chat=await Chat.findById(id);
  res.render("edit.ejs",{Chat});
})


// ----------------------------------------------
// Edit route-----------------------------------
app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit", { chat });
  
});

// update route
app.put("/chats/:id",async (req,res)=>{
  let {id}=req.params;
  let {message:newmsg}=req.body;
  let updatechat= await Chat.findByIdAndUpdate(id,
    {message:newmsg},
    {runValidators:true,new:true},
  );
  console.log(updatechat);
  res.redirect("/chats");
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
