if(process.env.NODE_ENV!="production"){
require('dotenv').config(); 
}
console.log(process.env.CLOUDINARY_API_KEY)
const express=require("express")
const app=express();
const port=8080;
const path=require("path")
const passport=require('passport')
const LocalStrategy=require("passport-local")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose=require('mongoose')
const cors=require("cors")
const session=require("express-session")
const User=require("./models/User")
const bodyParser = require("body-parser");
const userRoute=require("./Routes/User")
const listingRoute=require("./Routes/Project");
const Razorpay = require('razorpay')

// const cloudinary = require("./utils/cloudinary");
// const upload = require("./middleware/multer");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Project = require('./models/Project'); // Your project model
const {storage}=require("./cloudConfig")
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// configuring the payment 
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.REZORPAY_KEY_SECRET
  })
// Configure multer storage with Cloudinary
// const storage = multer.diskStorage({
//   'destination':'mainUploader'
// });
const upload = multer({storage });
// Initialize multer with the Cloudinary storage
// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB max file size
//   }
// });
// create a port option which is a exchange point of frontend and backend
app.listen(port,(req,res)=>{  
    console.log(`listening at the port ${port}`);

})
app.use(cors({
    origin: 'http://localhost:5173/', // Allow requests only from your frontend
    credentials: true // If you're using cookies or sessions
  }));

async function main() {
    return await mongoose.connect('mongodb://127.0.0.1:27017/Projects')
}



main().then(()=>console.log("database connected successFully"))
.catch((err)=>console.log("error while connecting database at index.js at line 26"))

const sessionOptions={
    secret:"mysupersecretcode",resave:false,saveUninitialized:true,
    cookie:{
        expires:Date.now()+2*24*60*60*1000,
        maxAge:2*24*60*60*1000
    }
}
app.use(express.json()); // This enables JSON body parsing
app.use(express.urlencoded({ extended: true })); // Allows form data parsing


app.use(session(sessionOptions)) 
app.use(passport.initialize()) 
app.use(passport.session()); 
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true})) 
passport.use(new LocalStrategy(User.authenticate())); 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create a new user if not found
        user = await User.create({ username: profile.displayName, googleId: profile.id });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser(User.serializeUser()) 
passport.deserializeUser(User.deserializeUser()) 

// Endpoint to create an order
app.post('/api/create-order', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    // Razorpay expects amount in paise
    const options = {
      amount: amount * 100,       // Convert INR to paise
      currency: currency,
      receipt: 'order_rcptid_11', // You can make this dynamic
    };

    // Create an order using Razorpay API
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id }); // Send the order ID back to the frontend
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ error: 'Error creating order' });
  }
});
// routers of the project
app.use("/api/listings",listingRoute)
app.use('/api/user',userRoute);

