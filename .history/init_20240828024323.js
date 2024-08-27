const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

 let Chats=[
    {
  from: "neha", 
  to: "shivam",
  message: "i l u",
  created_at: new Date(), 
},{
  from: "shivam", 
  to: "neha",
  message: " i cant accept",
  created_at: new Date(), 
},{
  from: "neha", 
  to: "shivam",
  message: "why",
  created_at: new Date(), 
},{
  from: "shivam", 
  to: "neha",
  message: "i don't linke u",
  created_at: new Date(), 
},


];

Chat.insertMany(Chats);

