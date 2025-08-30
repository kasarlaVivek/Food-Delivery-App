import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// placing user order for frontend
const placeOrder = async(req,res) => {
    const frontend_url = "http://localhost:5174";
    
    // Initialize Stripe with error checking
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY is not set in environment variables');
        return res.json({success:false, message:"Payment system configuration error"});
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe initialized successfully');

    try{
        console.log('Starting order placement...');
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        console.log('Order saved to database:', newOrder._id);
        
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});
        console.log('Cart cleared for user:', req.body.userId);

        console.log('Creating line items for Stripe...');
        const line_items = req.body.items.map((item) => ({
            price_data:{
                currency:'usd',
                product_data:{
                    name:item.name
                },
                unit_amount:item.price * 100,
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:'usd',
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:200, 
            },
            quantity:1
        });

        console.log('Line items created:', line_items);
        console.log('Creating Stripe checkout session...');
        
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });
        
        console.log('Stripe session created successfully:', session.id);
        console.log('Session URL:', session.url);

        res.json({success:true, session_url: session.url});
        console.log('Response sent successfully');
    }catch(err){
        console.error("Error placing order:", err);
        res.json({success:false, message:"Error placing order"});
    }
}

const verifyOrder = async (req, res) => {
   const {orderId,success} = req.body;
   try{
    if(success=='true'){
        await orderModel.findByIdAndUpdate(orderId, {payment:true});
        res.json({success:true, message:"Paid"});
    }else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false, message:"Not paid"});
    }
   }catch(err){
       console.error("Error verifying order:", err);
       res.json({success:false, message:"Error verifying order"});
   }
}

// user orders for frontend
const userOrders = async(req,res) => {
    try{
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders});
    }catch(err){
        console.log(err);
        res.json({success:false, message:"Error fetching orders"});
    }
}

// Listing orders from admin panel
const listOrders = async(req,res) => {
    try{
        const orders = await orderModel.find({});
        res.json({success:true, data:orders});
    }catch(err){
        console.log(err);
        res.json({success:false, message:"Error"});
    }
}

// api for updating order status
const updateStatus = async(req,res) => {
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Status updated"});
    }catch(err){
        console.log(err);
        res.json({success:false, message:"Error updating status"});
    }
}

export { placeOrder, verifyOrder,userOrders,listOrders,updateStatus };