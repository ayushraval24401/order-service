import amqp, { Channel } from "amqplib";
import orderServices from "../services/orderServices";

let channel: Channel;

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  const connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}

connect().then(async () => {
  // channel.deleteQueue("ORDER");
  await channel.consume("ORDER", async (data: any) => {
    channel.ack(data);
    const { products, userEmail, userId } = JSON.parse(data?.content);
    const newOrder = await orderServices.createOrder(
      products,
      userEmail,
      userId
    );

    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify(newOrder)));
  });
});

let emailChannel: Channel;
async function emailconnect() {
  const amqpServer = "amqp://localhost:5672";
  const connection = await amqp.connect(amqpServer);
  emailChannel = await connection.createChannel();
  await emailChannel.assertQueue("email-reply");
}

emailconnect().then(()=>{
  // emailChannel.deleteQueue("email-reply");
});

export const sendEmailQueue = (queueName: string, data: any) => {
  emailChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
};
export const receiveEmailQueue = async (queueName: string) => {
  const myPromise = new Promise(async (resolve, reject) => {
    try {
      await emailChannel.consume(queueName, async (data: any) => {
        const resData = JSON.parse(data?.content);
        emailChannel.ack(data);
        const receivedData = {
          message: resData?.message,
          status: resData?.status,
        };
        resolve(receivedData);
      });
    } catch (err) {
      reject(err);
    }
  });
  return myPromise;
};
