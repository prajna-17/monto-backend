import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    title: String, // snapshot in case product is deleted later
    images:[],
    category:String,
    price: Number,
    quantity: {
        type: Number,
    },
    subtotal: Number,   // calculated: quantity * effective price
}, { _id: false });


const shippingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    addressLine: {
        type: String,
        required: true
    },
    landmark: String,
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
}, { _id: false });



const orderSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  products: {
    type: [orderProductSchema],
    required: true
  },

  shippingAddress: {
    type: shippingSchema,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  isCompleted: {
    type: Boolean,
    default: false 
  },

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);