import User from '../models/user.model.js'

async function searchUser(req,res){
    try {
        const { search } = req.body;

        const query = new RegExp(search,'ig')

        const user = await User.find({ email : query}).select('-password');

        return res.status(200).json({
            message: "searched user",
            data: user,
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: true
        })
    }
}

export default searchUser;