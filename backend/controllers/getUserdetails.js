import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const getUserDetails = async(req,res) => {

    try {
        const token = req.cookies.token || ''
        //console.log(token)
        if(!token){
            return{ 
                message: "session out",
                logout: true
            }
        }
      
        const decode = await jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findById(decode.id).select(" -password")
   
        if(!user){
            return res.status(404).json({
                message: "User not found",
                error: true
            })
        }
       // console.log('user info from server',user)

        return res.status(200).json({
            success: true,
            user: {
            _id: user._id,
           name: user.name,
          email: user.email,
          profileImage: user.profileImage
            }
        })
    } catch (error) {
          return res.status(500).json({
                message: "Error in finding user from server",
                error: true
            })
    }
}