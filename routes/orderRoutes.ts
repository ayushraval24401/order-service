import express from "express";
import OrderController from "../controllers/orderControllers";
import isAuth from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/",isAuth, OrderController.GetAllOrdersController);
router.post("/send-order", OrderController.SendOrderController);

export default router;
