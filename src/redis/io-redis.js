const Redis = require('ioredis');
//redis client library for nodejs
//It gives automatic pipeline
const redis = new Redis();

async function ioRedisDemo(){
    try{
        await redis.set('key','value')
        const val = await redis.get('key');
        console.log(val)

    }catch(e){
        console.error(e)

    }finally{
        redis.quit();
    }
}

ioRedisDemo();