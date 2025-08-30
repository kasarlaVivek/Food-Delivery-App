import userModel from '../models/userModel.js';

// add item to cart
const addToCart = async (req, res) => {
   try{
      let userData = await userModel.findOne({_id: req.body.userId});
      if (!userData) {
         return res.json({success: false, message: "User not found"});
      }
      let cartData = userData.cartData;
      if(!cartData[req.body.itemId]){
        cartData[req.body.itemId] = 1
      }else{
        cartData[req.body.itemId] += 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData: cartData});
      res.json({success: true, message: "Item added to cart successfully"});
   }catch(err){
      console.log(err);
      res.json({success: false, message: "Error adding item to cart"});
   }
}

// remove item from cart
const removeFromCart = async (req, res) => {
    try{
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success: true, message: "Item removed from cart successfully"});
    }catch(err){
        console.log(err);
        res.json({success: false, message: "Error removing item from cart"});
    }
}

// fetch cart items
const getCart = async (req, res) => {
     try{
         let userData = await userModel.findById(req.body.userId);
         let cartData = userData.cartData;
         res.json({success: true, cartData});
     }catch(err){
         console.log(err);
         res.json({success: false, message: "Error fetching cart items"});
     }
}

export { addToCart, removeFromCart, getCart };