import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://vivekkasarla781:munna310@cluster-1.the8l7i.mongodb.net/food-del')
    .then(() => console.log('Db is connected'));
}