const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const { log } = require("console");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  console.log(chats);
  res.render("index.ejs", { chats });
});

app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/chats", (req, res) => {
  let { from, to, message } = req.body;

  if (!from || !to || !message) {
    console.log("Required fields are missing");
    return res.redirect("/chats/new");
  }

  let newChat = new Chat({
    from: from,
    to: to,
    message: message,
    created_at: new Date(),
  });

  newChat
    .save()
    .then((result) => {
      console.log("chat was saved", result);
      res.redirect("/chats");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/chats/new");
    });
});

app.get("/", (req, res) => {
  res.send("working");
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
