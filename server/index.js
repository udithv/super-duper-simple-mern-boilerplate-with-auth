const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Express App
const app = express();

// DB Setup
mongoose.connect('mongodb://localhost:27017/mern', { useNewUrlParser: true });

// Router Setup
const router = require('./router');


// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup

const port = process.env.PORT || 3090;

app.listen(port, () => {
    console.log(`Listening at port : ${port}`);
});