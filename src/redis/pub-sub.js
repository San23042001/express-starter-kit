const redis = require("redis");
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

//event listener

client.on("error", (error) =>
  console.log("Redis client error occurred!", error)
);

async function testAdditionalFeatures() {
  try {
    await client.connect();

    const subscriber = client.duplicate(); //create a new client -> shares the same connection
    await subscriber.connect(); //connect to redis server for the subscriber

    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`Received message from ${channel}:${message}`);
    });

    //publish message to the dummy channel
    // await client.publish("dummy-channel", "Dummy data from publisher");
    // await client.publish("dummy-channel", "Dummy data2 from publisher");

    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // await subscriber.unsubscribe("dummy-channel");
    // await subscriber.quit(); //close the subscriber connect

    //pipelining & transactions
    const multi = client.multi();
    multi.set("key-transaction1", "value1");
    multi.set("key-transaction2", "value2");
    multi.get("key-transaction1");
    multi.get("key-transaction2");

    const results = await multi.exec();
    console.log(results);

    const pipeline = client.multi();
    pipeline.set("key-pipeline1", "value1");
    pipeline.set("key-pipeline2", "value2");
    pipeline.get("key-pipeline1");
    pipeline.get("key-pipeline2");

    const pipelineresults = await pipeline.exec();
    console.log(pipelineresults);


    //batch data operation ->
    const pipelineOne = client.multi()
    for(let i=0;i<1000;i++){
        pipelineOne.set(`user:${i}:action`,`Action ${i}`);
    }

    await pipelineOne.exec();

    const dummyExample = client.multi()
    dummyExample.decrBy('account:1234:balance',100)
    dummyExample.incrBy('account:0000:balance',100)

    const finalresults = await dummyExample.exec();
    console.log(finalresults);
    

    
  } catch (e) {
  } finally {
    client.quit();
  }
}

testAdditionalFeatures();
