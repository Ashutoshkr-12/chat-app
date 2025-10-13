import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    name:{
        type: String,
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
     type: String,
     required:true,
    },
    profileImage: {
        type:String,

    }

}, { timestamps: true})

const User = mongoose.model('user', userSchema)

export default User;