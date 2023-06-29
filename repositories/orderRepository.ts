import OrderModel from "../models/orderModel";

class OrderRepository {
  async get() {
    const orders = await OrderModel.find();
    return orders;
  }

  async getUserOrders(userId: string) {
    const orders = await OrderModel.find({
      user: userId,
    });
    return orders;
  }

  async getDetails(id: String) {
    const order = await OrderModel.findById(id);
    return order;
  }

  async create(total: number, userEmail: string, user: string, products: [string]) {
    const order = await OrderModel.create({
      totalPrice: total,
      products: products,
      userEmail: userEmail,
      user: user,
    });
    return order;
  }
}

export default new OrderRepository();
