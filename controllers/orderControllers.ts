import { Request, Response, NextFunction } from "express";
import orderServices from "../services/orderServices";
import { receiveEmailQueue, sendEmailQueue } from "../queues/orderQueue";
import orderRepository from "../repositories/orderRepository";
import ExtendedRequest from "../interfaces/requestInterface";

class OrderController {
  async GetAllOrdersController(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user;

      const orders = await orderRepository.getUserOrders(userId?._id);
      // const orders = await orderRepository.get();

      return res.status(200).json({
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong in fetching orders : ", err });
    }
  }

  async SendOrderController(req: Request, res: Response, next: NextFunction) {
    try {
      const { subject, orderId, to } = req.body;

      if (!to || !subject || !orderId) {
        return res.status(403).json({
          message: "Validation failed",
        });
      }

      const order = await orderServices.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const emailData = {
        data: order,
        to,
        subject,
      };

      sendEmailQueue("email", emailData);

      await receiveEmailQueue("email-reply")
        .then((receivedData: any) => {
          return res.status(receivedData?.status).json({
            message: receivedData?.message,
          });
        })
        .catch((err) => {
          return res.status(err?.status).json({
            message: err?.message,
          });
        });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong in email sending : ", err });
    }
  }
}

export default new OrderController();
