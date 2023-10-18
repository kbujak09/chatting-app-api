const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');  

require('dotenv').config();
require('./auth/passport');

const app = express();

app.use(cors());  

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.listen(3000, () => console.log('Server running on port 3000!'));