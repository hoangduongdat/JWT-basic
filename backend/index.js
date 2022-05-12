const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const auth = require('./routers/auth')
const user = require('./routers/user')

dotenv.config()
const app = express();

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log("conect to mongodb")
})

app.use(cors());
app.use(cookieParser())
app.use(express.json())


//router
app.use("/v1/auth", auth)
app.use("/v1/user", user)

app.listen(8000, () => {
    console.log('server is running')
});
