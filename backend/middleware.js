import jwt from 'jsonwebtoken'

const authMiddleware = (req,res,next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            res.status(404).json({
                message:"Unauthorized",
                error: true
            })
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET)

        req.user = { id: decode.id, email: decode.email}

        next();
    } catch (error) {
        return res.status(500).json({
                message:"Unable to access tokens",
                error: true
            })
    }
}

export default authMiddleware;