const redis = require("redis");
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

//event listener

client.on("error", (error) =>
  console.log("Redis client error occurred!", error)
);


async function redisDataStructures(){
    try{
        await client.connect();
    //Strings -> SET,GET,MSET-Set Multiple,MGET-Get Multiple
    await client.set("user:name","Sanjaya Shetty");
    const name = await client.get("user:name")
    console.log(name);

    await client.mSet(["user:email","shetty@gmail.com","user:age","60","user:country","India"]);
    const [email,age,country] = await client.mGet(["user:email","user:age","user:country"]);
    console.log(email,age,country);

    // lists -> LPUSH - Insert element beginning,RPUSH - Insert element end, LRANGE,LPOP,RPOP

    // await client.lPush('notes',['note1','note2','note3'])
    const extractAllNotes = await client.lRange('notes',0,-1);
    console.log(extractAllNotes);

    const firstTask = await client.lPop('notes')
    console.log(firstTask)

    const remainingNotes = await client.lRange("notes",0,-1);
    console.log(remainingNotes,"remainingNotes");

    //sets -> SADD,SMEMBERS,SISMEMBER,SREM
    await client.sAdd('user:nickName',['john','varun','xyz'])
    const extractUserNicknames = await client.sMembers('user:nickName')
    console.log(extractUserNicknames);

    const isVarunIsOneofUserNickName = await client.sIsMember('user:nickName','varun')
    console.log(isVarunIsOneofUserNickName);

    await client.sRem('user:nickName','xyz');

    const getUpdatedUserNickNames = await client.sMembers('user:nickName');
    console.log(getUpdatedUserNickNames);

    //sorted sets-> ZADD,ZRANGE,ZRANK,ZREM
    await client.zAdd('cart',[{
        score:100,
        value:'Cart 1'
    },
    {
        score:150,
        value:'Cart 2'
    },
    {
        score:10,
        value:'Cart 3'
    },
    ]);

    const getTopCartItems = await client.zRange("cart",0,-1);
    console.log(getTopCartItems);


    const extractAllCartItemsWithScore = await client.zRangeWithScores('cart',0,-1);
    console.log(extractAllCartItemsWithScore)
    
    const cartTwoRank = await client.zRank('cart','Cart 2');
    console.log(cartTwoRank);


    //hashes -> HSET,HGET,HGETALL,HDEL
    await client.hSet('product:1',{
        name:'Product 1',
        description:'product one description',
        rating:'5'
    });

    const getProductRating = await client.hGet('product:1','rating');
    console.log(getProductRating);

    const getProductDetails = await client.hGetAll('product:1');
    console.log(getProductDetails);
    
    await client.hDel('product:1','rating');

    const updatedProductDetails = await client.hGetAll('product:1')
    console.log(updatedProductDetails);


    

    }catch(e){

    }finally{
        client.quit();
    }
}

redisDataStructures()