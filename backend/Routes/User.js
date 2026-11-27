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
router.post("/signup", async (req, res, next) => {
    try {
        const payload = req.body?.data || req.body || {};
        const username = (payload.name || payload.username || "").trim();
        const email = (payload.email || "").trim();
        const password = payload.password;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);

        req.logIn(registeredUser, (err) => {
            if (err) return next(err);
            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    _id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email,
                },
            });
        });
    } catch (err) {
        const status = err.name === "UserExistsError" ? 409 : 400;
        return res.status(status).json({ message: err.message });
    }
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({
                message: info?.message || "Invalid username or password",
            });
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.json({
                message: "Logged in successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
        });
    })(req, res, next);
});

router.get("/me", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        return res.status(200).json({
            authenticated: true,
            user: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
            },
        });
    }
    return res.status(200).json({ authenticated: false, user: null });
});
  
router.get('/lg',(req,res,next)=>{
    console.log("request accepeted at the route /api/user/lg")
    req.logOut((err)=>{
        if(err){
            return next(err)
        }else{
            res.status(200).json({ message: 'User logged-out successfully' });
        }
    })
})

module.exports=router;