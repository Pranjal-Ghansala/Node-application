const bcrypt = require("bcryptjs")
const User = require("../models/user")

const signup = async(req,res) =>{
    try{
        const { fullName,email,  password} = req.body

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser =  new User({
            fullName,
            email,
            password: hashedPassword,
        })

        if(newUser){
            createTokenForUser(newUser._id, res)
            await newUser.save()
            res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
                email: newUser.email,
				 
			});
        }else {
			res.status(400).json({ error: "Invalid user data" });
		}
    }catch{

    }


}

const login = async (req, res) =>{
    try{
        const {email, password} = req.body 
        const user = await User.findOne({email})
        const isPasswordCorrect = await bcrypt.compare(password,  user?.password || "")

        if(!user || !isPasswordCorrect){
            return res.json({error: "Invalid user or password"})
        }
        createTokenForUser(user._id, res)
        res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			 
		});
    } catch(error){

    }
}


module.exports = {
    signup,
    login,
  };