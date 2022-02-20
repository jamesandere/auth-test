const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')

const app = express();

dotenv.config();

mongoose.connect("mongodb://localhost:27017/authjwt")
.then(() => console.log("DB connection successful."))
.catch((err) => console.log(err))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})