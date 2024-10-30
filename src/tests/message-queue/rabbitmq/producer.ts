const amqp = require("amqplib");

const message = "Hello, RabbitMQ test ...";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log("sent: ", queueName);
  } catch (error) {
    console.log(error, "======error=======");
  }
};

runProducer().catch(console.error);
