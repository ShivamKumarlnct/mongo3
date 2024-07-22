const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const { log } = require("console");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// Index route
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
// update route
app.put("/chats")



// New chat form route
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

// Edit route
app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit", { chat });
  
});

// Root route
app.get("/", (req, res) => {
  res.send("working");
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
