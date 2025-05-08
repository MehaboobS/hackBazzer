const express=require("express")
const router=express.Router({mergeParams:true})
const Project=require("../models/Project")
const {storage}=require("../cloudConfig")
const multer=require("multer")
const upload = multer({storage });
const Review=require("../models/Review")

const ensureAuth = (req, res, next) => {
    console.log("inside is ensure auth method")
    console.log(req.body)
    console.log(req?.user)
    if (req.isAuthenticated()) {
        console.log("user authenicated successFull from ensureAuth method")
        return next();}
    return res.status(401).json({ error: "Not authenticated" });
  };
 router.post('/create', ensureAuth, upload.single('image'), async (req, res) => {
    try {
      // Debug: Log the request body and file
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
      
      // Create project object from request body
      const projectData = {
        name: req.body.name,
        description: req.body.description,
        github: req.body.github,
        demo: req.body.demo || '', // Optional field
        price: parseFloat(req.body.price),
        category: req.body.category,
        createdBy: req.user._id, // Assuming you have user data from auth middleware
      };
      
      // If we have an uploaded file, add the Cloudinary URL to the project
      if (req.file && req.file.path) {
        projectData.image = req.file.path; // Cloudinary URL
      }
      
      // Debug: Log the final project data before saving
      console.log('Project data to save:', projectData);
      
      // Create and save the new project to MongoDB
      const newProject = new Project(projectData);
      const savedProject = await newProject.save();
      
      // Return success response with the saved project
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project: savedProject
      });
  
    } catch (error) {
      console.error('Error creating project:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
  
      // Handle other errors
      res.status(500).json({
        success: false,
        message: 'Server error while creating project',
        error: error.message
      });
    }
  }); // ✅ <- This closing parenthesis and semicolon was missing

  router.get('/', async(req, res) => {
    try {
      const allProjects = await Project.find();
      res.status(200).json(allProjects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }); 
  router.get('/project/:id',async(req,res)=>{
    const {id}=req.params;
    const project=await Project.findById(id)
    console.log("console message of the route /api/listings/project/:id ",id);
    res.status(200).json(project);

  })
router.post('/project/:id/reviews',async(req,res)=>{
    console.log("request accepted at /project/${id}/reviews")
   const {rating,comment}=req.body;
   const {id}=req.params;
   console.log(id)
   const project=await Project.findById(id)
   let stars=rating;
   const newReview=new Review({stars,comment})
   newReview.projectId=project?._id;
   newReview.userId=req.user?._id;
   await newReview.save();
   console.log(newReview)
   project.reviews.push(newReview._id);
   await project.save();
    res.send("<h1>Review comment accepeted</h1>")
})

router.get('/project/:id/allReviews',async (req,res,next)=>{
    console.log("request has came at the route /project/:id/allReviews")
    const {id}=req.params;
    console.log(id)
    let reviews;
    await Project.findById(id).populate({
      path:"reviews",
      populate:{
        path:'userId',
        model:"User",
        select: 'username'
      }
    }).then((project)=>{
           console.log(project)
           let reviews=project.reviews
           res.json({reviews})
           
    })

})
module.exports=router;