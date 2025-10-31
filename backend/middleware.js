import jwt from 'jsonwebtoken'

const authMiddleware = (req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        //console.log('Auth header:',req.headers.authorization)
        if(!token){
           return res.status(404).json({
                message:"Unauthorized",
                error: true
            })
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decode;

        next();
    } catch (error) {
        return res.status(500).json({
                message:"Unable to access tokens",
                error: true
            })
    }
}

export default authMiddleware;