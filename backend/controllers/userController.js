import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


// login User
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false, message:"Invalid credentials"});
        }

        const token = createToken(user._id);
        res.json({success:true, token});
    }catch(err){
        console.log(err);
        res.json({success:false, message:"Internal server error"});
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Register User
const registerUser = async (req, res) => {
    const {name,email,password} = req.body;
    console.log('Register attempt:', { name, email, passwordLength: password?.length });
    
    try{
        // check if email already exists
       const exists = await userModel.findOne({email});
       if(exists){
        console.log('User already exists:', email);
        return res.json({success:false, message:"User already exists"});
       }

       // validate email & strong password
       if(!validator.isEmail(email)){
        return res.json({success:false, message:"Invalid email"});
       }
       if(password.length < 8){
        return res.json({success:false, message:"Password must be at least 8 characters long"});
       }

    //    hash password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);

       const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
       });
       const user = await newUser.save();
       console.log('User saved successfully:', user._id);
       const token = createToken(user._id);
       res.json({success:true,token})
    }catch(err){
       console.log('Registration error:', err);
       res.json({success:false, message:"Internal server error"});
       
    }
}



export { loginUser, registerUser };