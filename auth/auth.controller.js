const errorHandling = require ('../utils/errorHandling.js')
const httpStatusText = require('../utils/httpStatusText.js')
const hashAndCompare=require('../utils/HashAndCompare.js')
const User=require('../models/user.model.js')

const login = errorHandling.asyncHandler(async (req,res, next) => {
    const{email, password} =req.body
const user= await User.findOne({email})
if(!user)
    return next (new Error (`cant find user`,{cause:404}))
const isMatch= hashAndCompare.compare(password, user.password)

if(!isMatch)
    return next (new Error (`email or password is not correct`,{cause:404}))

return res.status(201).json({status : httpStatusText.SUCCESS , data : {user}})

})
const register = errorHandling.asyncHandler(async (req,res, next) => {
    const{username, email, password} =req.body
const user= await User.create({
    username,
    email,
    password:hashAndCompare.hash(password)

    
})
if(!user)
    return next (new Error (`cant create user`,{cause:400}))
return res.status(201).json({status : httpStatusText.SUCCESS , data : {user}})

})



module.exports={
    register,login
}