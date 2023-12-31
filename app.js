const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');  
const apiRouter = require('./routes/api');
const { Server } = require('socket.io');
const http = require('http');
const compression = require('compression');
const helmet = require('helmet');

require('dotenv').config();
require('./auth/passport');

const app = express();

const RateLimit = require('express-late-limit');
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
});

app.use(limiter);

app.use(cors());  

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

server.listen(3000, () => console.log('Server running on port 3000!'));

app.use('/api', apiRouter);