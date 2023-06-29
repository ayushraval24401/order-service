import orderRepository from "../repositories/orderRepository";

class OrderServices {
  async createOrder(products: any, userEmail: string, userId: string) {
    let total = 0;
    const newProducts = products?.map((product: any) => {
      total += Number(product.price);
      return product?._id;
    });
    const newOrder = await orderRepository.create(
      total,
      userEmail,
      userId,
      newProducts
    );
    return newOrder;
  }

  async getOrderById(orderId: string) {
    const order = await orderRepository.getDetails(orderId);
    return order;
  }
}

export default new OrderServices();
