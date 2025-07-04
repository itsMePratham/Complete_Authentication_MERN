const express = require("express");
const authRoutes = require("./Routes/auth");
const app = express();
 const cookieParser = require("cookie-parser")
require("dotenv").config();


//MIDDELWARE TO PARSE INTO JSON 
app.use(express.json());// allow us to parse incomming request: req.body
app.use(cookieParser());// it allow to parse incomming cookies


//DATABASE CONNECTION
const { connectDB } = require("./Database/connectDB");


// Specifing all the route used

app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at port number :${PORT}`);
});
