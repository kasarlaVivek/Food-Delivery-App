import jwt from 'jsonwebtoken';

const authMiddleware = async(req, res, next) => {
  const {token} = req.headers;
  console.log('Auth middleware - Token received:', token);
  
  if(!token){
    console.log('Auth middleware - No token provided');
    return res.json({success:false,message:"Authorization failed login again"});
  }
  try{
    const token_decode = jwt.verify(token,process.env.JWT_SECRET);
    console.log('Auth middleware - Token decoded successfully, userId:', token_decode.id);
    req.body.userId = token_decode.id;
    next();
  }catch(err){
    console.log("Error in auth middleware", err);
    return res.json({success:false,message:"Error"});
  }
}

export default authMiddleware;