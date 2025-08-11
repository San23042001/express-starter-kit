const redis = require("redis");
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

//event listener

client.on("error", (error) =>
  console.log("Redis client error occurred!", error)
);

async function testRedisConnection() {
  try {
    await client.connect();
    console.log("Connected to redis");

   await client.set("name","sanjay");


    const extractedValue = await client.get("name");
    console.log(extractedValue);

    const deleteCount = await client.del("name")
    console.log(deleteCount);

     const extractedUpdatedValue = await client.get("name");
    console.log(extractedUpdatedValue);

    await client.set('count',"100")
    const incrementCount = await client.incr("count");
    console.log(incrementCount);

    const decrementCount = await client.decr("count");
    console.log(decrementCount);
    
  } catch (error) {
    console.error(error);
  } finally {
    //Make sure there is no open connection
    await client.quit();
  }
}

testRedisConnection();
