import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: [true],   
    }
})