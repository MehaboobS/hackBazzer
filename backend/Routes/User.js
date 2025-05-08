const express=require("express")
const router=express.Router({mergeParams:true});
const User=require("../models/User")
const passport=require("passport")

// Google Auth Route
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Auth Callback Route
router.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
        console.log("successfully received the request at the route /auth/google/callback")
      // Ensure that email is available after successful Google login
      const { email, name } = req.user;

      // Check if the user exists in the database
      let user = await User.findOne({ email });
      
      if (!user) {
        // If user does not exist, create a new one
        user = new User({
          email,
          name,
          // other user details like password, etc.
        });
        await user.save();
      }

      // Redirect to dashboard or wherever you want
      res.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      res.redirect("/"); // Redirect to the home page in case of error
    }
  }
);
router.post("/signup",async (req,res,next)=>{
    console.log("Request successFully accepted");
    console.log(req.body.data);
    try {
        const { name : username, email, password } = req.body.data; 
        console.log(username,email,password)
        const user = new User({ username, email });
    
        await User.register(user, password); 
        console.log("user registered successFully")
    // Passport handles password hashing
        res.status(201).json({ message: 'User registered successfully' });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
})

router.post("/login", (req, res, next) => {
    console.log("request accepted")
    console.log(req.body)
    passport.authenticate("local", (err, user, info) => {
        console.log(user)
        if (err) return next(err); // Handle server errors
        if (!user) return res.status(401).json({ message: info.message }); // Handle incorrect credentials

        // Log in the user
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json({ message: "Logged in successfully", user });
        });
    })(req, res, next);
});
  
router.get('/lg',(req,res,next)=>{
    console.log("request accepeted at the route /api/user/lg")
    req.logOut((err)=>{
        if(err){
            return next(err)
        }else{
            // req.flash("success","logged successfully")
            // res.redirect('/listings')
            res.status(201).json({ message: 'User logged-out successfully' });
        }
    })
})

module.exports=router;