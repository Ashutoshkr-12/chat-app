import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import cloudinary from '../config/cloudinary.js';


const cookieOptions = {
 httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}


const registerUser = async(req,res) =>{

   try {
     const { name, email, password } = req.body;
     const file = req.file;
 
     //console.log('File from server: ',file)
     if(!name || !email || !password){
        return res.status(404).json({
            message: "All fields are required",
            error: true
        })
     }

     let imageUrl = null;
    // console.log("Cloudinary config:", cloudinary);

   
   try {
      if(file){
         const uploadResult = await new Promise((resolve,reject) => {
             const stream = cloudinary.uploader.upload_stream(
                 {folder: 'user-profilePic'},
                 (error,result) => {
                     if(error) reject(error);
                     else resolve(result);
                 }
             );
             stream.end(file.buffer);
         });
 
         imageUrl = uploadResult.secure_url
      }
   } catch (error) {
    console.error("Error in cloudinary:", error)
   }

     const existingUser = await User.findOne({ email });
 
     if(existingUser){
         return res.status(409).json({
            message:"user already exists with this email",
            error: true
         })
     }
 
     const hashedPassword = await bcrypt.hash(password,10)
 
     const createdUser = await User.create({
        name, 
        email,
        password: hashedPassword,
        profileImage: imageUrl,
     })

     const user = createdUser.toObject();
     delete user.password;
    // console.log(user)

 
     return res.status(200).json({
        message: "user created",
        data: user,
        success: true
     })


   } catch (error) {
    console.error("Error in creating user from server:",error);
    res.status(500).json({
        message: `Error in user creation from server:,${error.message}`,
        error: true
    })  
   }
}

const loginUser = async(req,res) =>{
    
   try {
     //console.log("Login request body:", req.body);
     const { email, password} = req.body;

     if(!email || !password){
        return res.status(404).json({
            message: "All fields are required",
            error: true
        })
     }
     
     const user = await User.findOne({email})
 
     if(!user){
        //console.error('User not found')
         return res.status(404).json({
             message: "User not found with this email",
             error: true
         }) 
     }

    
  const isValid = await bcrypt.compare(password,user.password)
 
     if(!isValid){
         return res.status(400).json({
             message: "Invalid credentials",
             error: true
         })
     }

     const userObj = user.toObject();
     delete userObj.password;

     const token = jwt.sign(
        { id: user.id, email: user.email},
        process.env.JWT_SECRET,{expiresIn: "7d"}
     )
 
     return res.cookie('token',token,cookieOptions).status(200).json({
         message:"User logged In",
         token,
         data: userObj,
     })

   } catch (error) {
    console.error("Error in user login from server:", error.message);
    return res.status(500).json({
        message: "Unable to login please try again after later",
        error: true
    })
   }
}

const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error.message);
    return res.status(500).json({
      message: "Logout failed",
      error: true,
    });
  }
};



//TODO: UPDATE FUNCTIONALITY
const updateUser = (req,res) =>{
    
}

export  {
    registerUser,
    loginUser,
    logoutUser,
};