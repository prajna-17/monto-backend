import express from "express";
import { createOrder,  fetchAllOrders,  fetchOrderDetails, fetchUserAllOrders, orderCompleted } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/",createOrder)
// router.post("/accept-order",acceptOrderRequest)
router.get("/",fetchAllOrders)
router.get("/:userId",fetchUserAllOrders)
router.get("/order-details/:orderId",fetchOrderDetails)
router.patch("/:orderId",orderCompleted)

export default router;
