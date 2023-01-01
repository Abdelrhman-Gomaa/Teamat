require('dotenv').config();
require('./startup/db')
const express = require('express')
const app = express();

require('./startup/routers')(app)

// Open Localhost Port || 3000
const port = 3000;
app.listen(port , ()=>{
    console.log(`Server Listening on port ${port}`)
});