const projects=require("./data")
const mongoose=require("mongoose")
const Project=require("../models/Project")
const User=require("../models/User")


async function main() {
    return await mongoose.connect('mongodb://127.0.0.1:27017/Projects')
}



main().then(()=>console.log("database connected successFully"))
.catch((err)=>console.log("error while connecting database at initProject.js at line 14"))

async function insertProjectDetails() {
    try {
      const id = "6807c69c60b1e0a8782c1035";
      const user = await User.findById(id);
  
      if (!user) {
        console.log("User not found");
        return;
      }
  
      // Await all the asynchronous operations inside map
      const newProjects = await Promise.all(
        projects.map(async (project) => {
          return {
            ...project,
            createdBy: user._id,
          };
        })
      );
  
      // Insert into the database
      const res = await Project.insertMany(newProjects);
  
      if (res && res.length > 0) {
        console.log("Data successfully inserted:", res.length, "projects added.");
      } else {
        console.log("Error while inserting the data");
      }
    } catch (err) {
      console.error("Error in insertProjectDetails:", err);
    }
  }
  
insertProjectDetails().then(()=>console.log("data inserted successfully"))
.catch((Err)=>console.log(Err))

