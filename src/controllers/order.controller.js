import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { createResponse, ErrorResponse } from "../utils/responseWrapper.js";

export const createOrder = async (req, res) => {
  try {
    const { customerId, products, shippingAddress } = req.body;

    // Validate customer exists or not
    const customerExists = await User.findById(customerId);
    if (!customerExists) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one product" });
    }

    let orderItems = [];
    let totalAmount = 0;

    // Validate products & calculate totals
    for (const item of products) {
      const dbProduct = await productModel.findById(item.product);

      if (!dbProduct) {
        return res.status(400).json({ message: `Invalid product ID: ${item.product}` });
      }

      if (!dbProduct.inStock) {
        return res.status(400).json({ message: `${dbProduct.title} is currently unavailable` });
      }

      
    //   const subtotal = Number(dbProduct.price.split(" ")[1]) * item.quantity;
      const subtotal = dbProduct.price * item.quantity;

      totalAmount += subtotal;

      orderItems.push({
        product: dbProduct._id,
        title: dbProduct.title,
        images: dbProduct.images,
        category: dbProduct.category,
        price: dbProduct.price,
        quantity: item.quantity,
        subtotal,
      });


    }

    // Create order document
    const newOrder = new orderModel({
      user: customerId,
      products: orderItems,
      shippingAddress,
      totalAmount,
    });

    await newOrder.save();


    const savedOrder = await orderModel.findById(newOrder._id)
      .populate("products.product", "title images");

    res.status(201).json(createResponse(201, savedOrder, "order place successfully"));

  } catch (error) {
    // res.status(500).json(ErrorResponse(500, "internal server error"));
    res.status(500).json(ErrorResponse(500,  error.message));
  }
};



export const fetchAllOrders = async (req, res) => {
  try {

    const allOrders = await orderModel.find({})


    return res.status(200).json(createResponse(200, allOrders, "all orders are fetched"))

  } catch (error) {
    res.status(500).json(ErrorResponse(500, error.message));
  }
};


export const fetchUserAllOrders = async (req, res) => {
  try {
    const userId = req.params.userId

    const userDetails = await User.findById(userId)

    if (!userDetails) {
      return res.status(400).json(ErrorResponse(400, "you can access orders section"))
    }

    const allOrders = await orderModel.find({})


    return res.status(200).json(createResponse(200, allOrders, "all orders are fetched"))

  } catch (error) {
    res.status(500).json(ErrorResponse(500, error.message));
  }
};


export const fetchOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId

    const orderDetails = await orderModel.findById({_id: orderId})

    if (!orderDetails) {
      return res.status(400).json(ErrorResponse(400, "order are not valid"))
    }


    return res.status(200).json(createResponse(200, orderDetails, "order details fetched"))

  } catch (error) {
    res.status(500).json(ErrorResponse(500, error.message));
  }
};


export const orderCompleted = async (req, res) => {
  try {
    const orderId = req.params.id

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {isCompleted:true},
      { new: true }
    )

    // const orderDetails = await orderModel.findById(orderId)

    if(!updatedOrder){
      return res.status(400).json(ErrorResponse(400,"order are not valid"))
    }

    // orderDetails.isCompleted = true

    // const updatedOrder = await orderDetails.save()

    return res.status(200).json(createResponse(200, updatedOrder, "order Status changed"))

  } catch (error) {
    res.status(500).json(ErrorResponse(500, error.message));
  }
};