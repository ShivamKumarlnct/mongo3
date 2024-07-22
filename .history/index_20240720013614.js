const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const { log } = require("console");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// let chat1 = new Chat({
//   from: "neha", 
//   to: "shivam",
//   message: "i l u",
//   created_at: new Date(), 
// });

// chat1.save().then((res) => {
//   console.log(res);
// }).catch(err => console.log(err)); 

// Index routes

app.get("/chats",async (req,res) => {
 let chats= await Chat.find();
 console.log(chats);
 res.render("index.ejs",{chats})
})

// new route post

app.get("/chats/new", (req,res)  => {
res.render("new.ejs")
})

// create route

app.post("/chats",(req,res)=>{

let { from,to,message}=req.body;

let newChat=new Chat({
  from:from,
  to:to,
  message:message,
  created_at:new Date(),
});
newChat
.save()
.then((res)=>{
  console.log("chat was save");

})
.catch((err) => {
  console.log(err);
});

res.redirect("/chats");

});

// edit

app.get("/chats/:id/edit",(req,res)=>{
 let {id}=req.params;
 let chat=await Chat.findById(id);
  res.render("/edit.ejs")
})



app.get("/", (req, res) => {
  res.send("working");
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
