const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');  
const apiRouter = require('./routes/api');
const { Server } = require('socket.io');
const http = require('http');

require('dotenv').config();
require('./auth/passport');

const app = express();

app.use(cors());  

const server = http.createServer(app);

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on('connection', (socket) => {

  socket.on('join_room', (data) => {
    socket.join(data)
  });

  socket.on('send_message', (data) => {
    console.log(data)
    socket.to(data.toId).to(data.newMessage.from).emit('receive_message', data.newMessage)
  })
})

server.listen(5000, () => console.log('Server running on port 5000!'));

app.use('/api', apiRouter);